# Creator Support AI — Comment Hub

A mobile-first, local-first workspace for organising creator support and reviewing comment drafts.

## Current build

- Creator records: add, edit, search, pause/reactivate and remove saved Facebook creator links.
- Creator feed: view posts saved for an individual creator.
- Manual post intake: save a public Facebook post/Reel URL, caption, transcript/video description and topic.
- Comment review: edit and save a draft, copy it and open the original post, skip or dismiss it.
- Honest publishing state: copying a comment is recorded as **Comment copied**, not published. The user can explicitly confirm after manually publishing.
- History: search and filter by creator and status.
- Dashboard: counts are calculated from actual local records.
- Backup/restore: export and import a JSON backup.
- Preferences: language, tone, length and cultural-context instructions.
- Backward compatibility: existing `csai_creators`, `csai_posts` and preference values in localStorage are retained and migrated in place.

## Run it

Open `index.html` in a modern browser or deploy the repository to a static host such as Vercel. No build step is required.

## Important limits — not connected yet

This is still a browser-only prototype/foundation. It does **not** currently provide:
- Real LLM-powered comment generation (the draft helper is a small local starter function).
- Facebook/Meta API connection, automatic creator monitoring or automatic feed discovery.
- Automatic downloading, viewing or transcription of Facebook Reels.
- User accounts, cloud database, multi-device sync or scheduled jobs.
- Direct comment publishing.

Facebook interactions remain manual: copy the draft, open the original post, paste and publish on Facebook, then explicitly confirm in the app. Meta access depends on official API permissions, app review and the relevant account/page type. Do not collect Facebook passwords, session cookies or automate private browser sessions.

## Next implementation stages

1. Add hosted authentication and persistent database with per-user access controls and a safe local-data migration.
2. Add a secure server-side AI endpoint; keep provider keys out of browser code.
3. Add supported Meta Page integrations only after permissions and access are configured; keep a manual fallback for personal profiles or inaccessible content.
4. Add scheduled discovery, operational monitoring, backups and deployment verification.
