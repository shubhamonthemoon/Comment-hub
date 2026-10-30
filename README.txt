# Creator Support AI — Comment Hub

A mobile-first workspace for organising creator support and reviewing comment drafts.

## Current build

- Creator records: add, edit, search, pause/reactivate and remove saved Facebook creator links.
- Creator feed: view posts saved for an individual creator.
- Manual post intake: save a public Facebook post/Reel URL, caption, transcript/video description, topic and optional public image URL.
- AI endpoint: server-side OpenAI Responses API integration. The OpenAI key remains in Vercel environment variables; the browser never receives it. A local starter fallback is clearly labelled when AI is not configured or unavailable.
- Comment review: edit and save a draft, copy it and open the original post, skip or dismiss it.
- Honest publishing state: copying a comment is recorded as **Comment copied**, not published. The user can explicitly confirm after manually publishing.
- History: search and filter by creator and status.
- Dashboard: counts are calculated from actual local records.
- Backup/restore: export and import a JSON backup.
- Preferences: language, tone, length and cultural-context instructions.
- Supabase foundation: email sign-up/sign-in, per-user RLS schema and manual cross-device sync.
- Backward compatibility: existing `csai_creators`, `csai_posts` and preference values in localStorage are retained.

## Deploy and configure

See [SETUP.md](SETUP.md). Required environment variables are listed in `.env.example`.

## Important limits — still not connected/available

- Real AI requires an OpenAI API key and a private AI access code configured in Vercel.
- Cloud sync requires a Supabase project, the SQL schema to be applied, and Supabase URL + anon key configured in Vercel.
- AI can analyse supplied text and an optional public HTTPS image URL. It does not automatically fetch Facebook content, download/watch Reels, or transcribe audio.
- Facebook/Meta automatic discovery requires an approved Meta app, the correct Page permissions, owner-authorised Page access and webhook/token setup. Arbitrary personal-profile monitoring is not a general public API capability.
- No scheduled monitoring or automatic comment publishing is implemented.
- Manual Facebook workflow remains: copy the draft, open the original post, paste and publish on Facebook, then explicitly confirm in the app.

Never collect Facebook passwords, session cookies or browser login tokens.
