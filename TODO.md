# TODO — things only you can do

Everything in Stages 0–2 is done and committed. The items below need **your**
accounts, so they are the only thing blocking the rest of the plan
(`~/.claude/plans/my-ultimate-plan-is-concurrent-deer.md`).

Ordered by what unblocks the most work.

---

## 1 · Create the Supabase project — blocks Stage 3 (auth) onward

- [ ] Sign up / log in at <https://supabase.com/dashboard>
- [ ] **New project** → name it `target-ladder`, region **closest to you** (Mumbai / `ap-south-1` if offered — it decides every request's latency)
- [ ] Save the database password somewhere safe. It is shown **once** and you need it for backups later.
- [ ] Go to **Project Settings → API** and copy these two values back to me:

```
NEXT_PUBLIC_SUPABASE_URL   = https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
```

> **The anon key is safe to share and safe to commit** — it is public by design,
> and Row Level Security is what protects the data.
> **The `service_role` key is NOT.** Never paste it to me, never commit it. If it
> leaks, it bypasses every security policy in the database.

Free tier is comfortably enough: at 100 users / 20 arenas you use roughly **26 MB
of the 500 MB** database and **~157 MB of ~5 GB** monthly egress.

---

## 2 · Turn on the sign-in providers — blocks Stage 3

In **Authentication → Providers**:

- [ ] **Google** — enable. Needs a Google Cloud OAuth client:
      <https://console.cloud.google.com/apis/credentials> → *Create credentials →
      OAuth client ID → Web application*. Paste the callback URL Supabase shows
      you into **Authorised redirect URIs**, then paste Google's Client ID and
      Secret back into Supabase.
- [ ] **GitHub** — enable. <https://github.com/settings/developers> → *New OAuth
      App*. Same shape: Supabase gives you the callback URL, GitHub gives you an
      ID and secret.
- [ ] **Email** — already on by default. See item 3, which it depends on.

---

## 3 · Configure custom SMTP — do this BEFORE you share the link

**This is the single most likely thing to break on launch day.** Supabase's
built-in email is rate-limited to a few messages an hour. That is fine while
testing alone and useless at 100 users: password resets and confirmations will
start silently failing.

- [ ] Create a free Resend account — <https://resend.com> (~3,000 emails/month free)
- [ ] Verify a sending domain, or use their test sender to start
- [ ] In Supabase: **Project Settings → Authentication → SMTP Settings** → enable
      custom SMTP and paste Resend's host, port, user and key
- [ ] Send yourself a password reset and confirm it actually arrives

> Google and GitHub sign-in send **no email at all**, so they are unaffected. If
> you wanted to postpone this, the workaround is to launch with OAuth only and
> add email+password later — your call.

---

## 4 · Connect the repo to Vercel — blocks the live URL

Next.js needs a Node host, so Cloudflare Pages' static hosting will not serve it.

- [ ] Push this repo to GitHub if it is not there yet (see item 7 — nothing has
      been pushed yet)
- [ ] <https://vercel.com/new> → import the repo → framework auto-detects Next.js
- [ ] Set the branch to deploy. Right now the work is on **`ladder-ver2`**, not `main`
- [ ] Add the two env vars from item 1 under **Settings → Environment Variables**
- [ ] Deploy, and send me the URL — it goes into Supabase's allowed redirect URLs
      so OAuth returns to the right place

---

## 5 · Set up backups — before anyone else's data is in there

The Supabase free tier has **no automatic backups**, and a user's value here is
154 days of accumulated progress. Losing it is unrecoverable.

- [ ] Decide where a weekly `pg_dump` should land (a folder on this machine is fine)
- [ ] I can write the script — it needs the database password from item 1

The app's JSON export already works and stays as the manual fallback.

---

## 6 · Optional: upgrade Node

You are on **v20.9.0**. Vitest 3.x needs `node:util.styleText`, added in 20.12,
so I pinned Vitest to 2.x. Everything works; this only stops you from being
current.

- [ ] Install Node 22 LTS from <https://nodejs.org> if you want to unpin it
- [ ] Then tell me, and I will bump Vitest and re-run the suites

---

## 7 · Decide about pushing

There are **7 local commits** on `ladder-ver2` and **1 on `main`**. Nothing has
been pushed anywhere.

- [ ] Confirm whether to push, and whether `main` should go up too
- [ ] If this repo has no GitHub remote yet, tell me and I will set one up

---

## Not blocking me

I can write the database schema, the RLS policies, the migrations and the sync
engine against the env var *names* before the project exists. So if you want to
work through the list above in parallel, say so and I will keep building — I
will just not be able to run anything against a live database until item 1 lands.

---

## Separately: the four content gaps from the review

Not part of the rewrite, but the highest-value work on the sheet itself, ranked
by return per hour:

1. **Tech practice problems for 12 of 13 modules** — only Concurrency has any.
   Costs JPM (~835) and Amex (~845) the most, and their own "biggest lever" text
   points straight at modules with nothing to *do*.
2. **SD sessions 17 and 18 have no worked solution** — session 18 is named in
   Amex's biggest-lever text.
3. **LLD depth for the machine-coding tier** — 4 tier-C problems for Uber and
   Flipkart, who weight it heaviest.
4. **Apple has no angle anywhere** — appears in only 2 of 10 SD angles, both as
   a bolt-on "Uber / Apple".

Say the word and I will write any of these into `content/`; the sheet regenerates
from it automatically.
