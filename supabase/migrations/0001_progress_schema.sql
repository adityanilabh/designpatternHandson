-- Target Ladder — per-user progress
--
-- Progress is stored as ROWS, not one JSON blob per user. A fully populated
-- user is ~900 item keys and ~400KB, which is too big to PUT on every click
-- and far too big to fetch ten of when drawing an arena leaderboard. Rows make
-- a change a single small upsert and let the server aggregate.
--
-- Item keys are content-addressed and identical to the ones the local tracker
-- has always used (ds-<section>-<block>-<i>, sd-<n>, ld-<id>, tq-<mod>-<i>,
-- lp-story-<i>, pt-<section>-<i>, and so on). They are the primary keys here,
-- which is why they must not be restructured casually.

-- ---------------------------------------------------------------- profiles --
-- One row per account. Separate from auth.users because auth.users is managed
-- by Supabase and should not carry application columns.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  handle      text        not null,
  avatar_url  text,
  -- the plan's day 1. Per-user because two people can run the ladder on
  -- different calendars.
  start_date  date        not null default '2026-08-31',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Handles are shown on arena leaderboards, so they must be unique — but
-- case-insensitively, or "Aditya" and "aditya" are two different people to the
-- database and the same person to everyone reading it.
create unique index if not exists profiles_handle_lower_key
  on public.profiles (lower(handle));

-- ----------------------------------------------------------- progress items --

create table if not exists public.progress_items (
  user_id       uuid        not null references public.profiles (id) on delete cascade,
  item_key      text        not null,
  done          boolean     not null default false,
  status        text        not null default ''
                            check (status in ('', 'clean', 'ugly', 'failed')),
  mins          integer     not null default 0 check (mins >= 0),
  -- the log. mistake is the root cause, and the point of the whole exercise.
  log_trigger   text,
  log_technique text,
  log_mistake   text,
  updated_at    timestamptz not null default now(),
  primary key (user_id, item_key)
);

-- Delta pulls ask "what changed since I last synced", so this index is what
-- keeps sync cheap as a user's history grows.
create index if not exists progress_items_user_updated_idx
  on public.progress_items (user_id, updated_at desc);

-- ----------------------------------------------------------------- reviews --
-- The +1 / +3 / +7 / +16 day re-solve schedule. Separate table rather than an
-- array column so the revision queue is a plain indexed query across all items
-- rather than a scan that unnests every user's arrays.

create table if not exists public.reviews (
  user_id   uuid    not null,
  item_key  text    not null,
  due       date    not null,
  done      boolean not null default false,
  primary key (user_id, item_key, due),
  foreign key (user_id, item_key)
    references public.progress_items (user_id, item_key) on delete cascade
);

-- "what is due" is the query the header badge and the Revision tab both run.
create index if not exists reviews_user_due_idx
  on public.reviews (user_id, due) where not done;

-- ------------------------------------------------------------ drill states --
-- Pattern drills (pt-*) and template drills, which live in their own key space
-- and hold a three-way state rather than done/not-done.

create table if not exists public.drill_states (
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  key        text        not null,
  kind       text        not null check (kind in ('pattern', 'template')),
  status     text        not null default ''
                         check (status in ('', 'unknown', 'learning', 'fast')),
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- ------------------------------------------------------------------- notes --
-- Free text per section, module, session, week, and the seven fields of each
-- behavioural story slot.

create table if not exists public.notes (
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  key        text        not null,
  body       text        not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- --------------------------------------------------------- week overrides --
-- The "Unlock anyway" escape hatch, so a week you cannot finish never traps
-- you permanently.

create table if not exists public.week_unlocks (
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  week        smallint    not null check (week between 1 and 22),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, week)
);

-- ------------------------------------------------------- updated_at upkeep --
-- Last-write-wins conflict resolution compares updated_at, so it must be set
-- by the database. A client clock that is wrong or dishonest would otherwise
-- decide which device's edit survives.

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists progress_items_touch on public.progress_items;
create trigger progress_items_touch before insert or update on public.progress_items
  for each row execute function public.touch_updated_at();

drop trigger if exists drill_states_touch on public.drill_states;
create trigger drill_states_touch before insert or update on public.drill_states
  for each row execute function public.touch_updated_at();

drop trigger if exists notes_touch on public.notes;
create trigger notes_touch before insert or update on public.notes
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------ profile on account create --
-- Every authenticated user needs a profile row before they can write progress,
-- and making the client do it means a failed call leaves an account that can
-- never save anything. security definer so it can write past RLS.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  n int := 0;
begin
  -- GitHub gives user_name, Google gives full_name, email is the fallback.
  base := coalesce(
    new.raw_user_meta_data ->> 'user_name',
    new.raw_user_meta_data ->> 'preferred_username',
    new.raw_user_meta_data ->> 'full_name',
    split_part(coalesce(new.email, 'runner'), '@', 1)
  );
  base := nullif(regexp_replace(lower(base), '[^a-z0-9_-]', '', 'g'), '');
  base := coalesce(base, 'runner');
  candidate := base;

  -- handles are unique, and two people called "aditya" is not an error case
  -- worth failing a signup over
  while exists (select 1 from public.profiles p where lower(p.handle) = lower(candidate)) loop
    n := n + 1;
    candidate := base || n::text;
  end loop;

  insert into public.profiles (id, handle, avatar_url)
  values (new.id, candidate, new.raw_user_meta_data ->> 'avatar_url')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------ row level security --
-- Enabled on EVERY table. A table without RLS is readable by anyone holding
-- the anon key, which is shipped to every browser — so "forgot to enable it"
-- is the same as "published it".
--
-- These policies are own-rows-only. Arena-scoped peer reads are added in the
-- arenas migration, deliberately as a separate, reviewable change.

alter table public.profiles       enable row level security;
alter table public.progress_items enable row level security;
alter table public.reviews        enable row level security;
alter table public.drill_states   enable row level security;
alter table public.notes          enable row level security;
alter table public.week_unlocks   enable row level security;

-- profiles: readable and writable only by their owner for now.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = (select auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Insert is handled by the trigger, but allow it so a user whose profile is
-- somehow missing can recover instead of being permanently unable to save.
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert with check (id = (select auth.uid()));

-- The rest: one policy per table covering all four operations. `with check` is
-- what stops a user writing a row under someone else's user_id; `using` alone
-- would only restrict what they can see.
drop policy if exists progress_items_own on public.progress_items;
create policy progress_items_own on public.progress_items
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists reviews_own on public.reviews;
create policy reviews_own on public.reviews
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists drill_states_own on public.drill_states;
create policy drill_states_own on public.drill_states
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists notes_own on public.notes;
create policy notes_own on public.notes
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists week_unlocks_own on public.week_unlocks;
create policy week_unlocks_own on public.week_unlocks
  for all using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
