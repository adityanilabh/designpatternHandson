-- Backfill profiles for accounts that predate the trigger.
--
-- handle_new_user() fires on auth.users INSERT, so it only covers accounts
-- created after 0001 was applied. Anyone who signed in before that has an
-- auth.users row and no profile, which makes every progress write fail on
-- progress_items_user_id_fkey — the account can authenticate and can save
-- nothing.
--
-- Idempotent: safe to re-run, and harmless once every account has a profile.

insert into public.profiles (id, handle, avatar_url)
select
  u.id,
  -- same derivation as handle_new_user(), with a numeric suffix for
  -- collisions. row_number() disambiguates two users whose derived handle is
  -- identical within this single statement, which the per-row loop in the
  -- trigger cannot see.
  coalesce(
    nullif(regexp_replace(lower(coalesce(
      u.raw_user_meta_data ->> 'user_name',
      u.raw_user_meta_data ->> 'preferred_username',
      u.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(u.email, 'runner'), '@', 1)
    )), '[^a-z0-9_-]', '', 'g'), ''),
    'runner'
  )
  || case
       when row_number() over (
         partition by coalesce(
           nullif(regexp_replace(lower(coalesce(
             u.raw_user_meta_data ->> 'user_name',
             u.raw_user_meta_data ->> 'preferred_username',
             u.raw_user_meta_data ->> 'full_name',
             split_part(coalesce(u.email, 'runner'), '@', 1)
           )), '[^a-z0-9_-]', '', 'g'), ''),
           'runner'
         )
         order by u.created_at
       ) = 1 then ''
       else row_number() over (
         partition by coalesce(
           nullif(regexp_replace(lower(coalesce(
             u.raw_user_meta_data ->> 'user_name',
             u.raw_user_meta_data ->> 'preferred_username',
             u.raw_user_meta_data ->> 'full_name',
             split_part(coalesce(u.email, 'runner'), '@', 1)
           )), '[^a-z0-9_-]', '', 'g'), ''),
           'runner'
         )
         order by u.created_at
       )::text
     end,
  u.raw_user_meta_data ->> 'avatar_url'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;
