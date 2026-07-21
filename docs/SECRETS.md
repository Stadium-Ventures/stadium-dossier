# Secrets — where they live and how to get them

This file documents every secret this app uses: what it's for and where the
canonical value lives. **Never put an actual secret value in this file, in
code, or in any commit.**

All runtime env vars are set in the app's Vercel project
(Vercel dashboard → stadium-dossier → Settings → Environment Variables).
`VITE_*` vars are baked in at build time and visible in the shipped bundle —
they are public by design here.

| Name | What it's for | Where the value comes from |
|---|---|---|
| `VITE_SUPABASE_URL` | Dossier's Supabase project | Supabase dashboard → project → Settings → API (https://supabase.com/dashboard) |
| `VITE_SUPABASE_ANON_KEY` | Client-side Supabase key (public by design; RLS is the security boundary) | Same Supabase API settings page |

Note: this app intentionally has no server-side service-role key in Vercel.
If one is ever added, document it here and never expose it via a `VITE_` var.

## Conventions

- To hand a secret to a teammate, set it where they need it (Vercel env or
  `gh secret set`) rather than pasting the value in Slack.
