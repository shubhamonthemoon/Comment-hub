# Setup guide — Creator Support AI / Comment Hub

This repository is the existing project, extended in a separate feature branch. Do not commit secrets to GitHub.

## 1. Deploy the code

1. Open the pull request linked from the project handover.
2. Review and merge it into `main` when ready.
3. In Vercel, confirm the project is connected to this GitHub repository and deploys from `main`.
4. The `api/` folder is deployed as Vercel serverless functions.

## 2. Enable real AI comments

In Vercel → Project → Settings → Environment Variables, add:

- `OPENAI_API_KEY`: your OpenAI API key (server-side secret; never put it in browser code or GitHub).
- `OPENAI_MODEL`: optional model name; defaults to `gpt-5.5`.
- `AI_ACCESS_CODE`: choose a long private access code for this app.

Redeploy after adding variables. In the app Settings, enter the AI access code (not the OpenAI API key). The browser calls `/api/generate-comment`; the API key remains on the server. If no AI access code is entered, the app labels its local fallback as a starter draft.

The AI endpoint currently supports caption, user-supplied transcript/description, topic and an optional publicly accessible HTTPS image URL. It does not automatically retrieve Facebook posts, download Reels, or transcribe audio.

## 3. Prepare cloud database and authentication

1. Create a Supabase project.
2. Open SQL Editor and run all of `supabase/schema.sql`.
3. In Vercel environment variables, add:
   - `SUPABASE_URL`: Project URL.
   - `SUPABASE_ANON_KEY`: publishable/anon key only.
4. Never use the Supabase service-role key in the browser.
5. Redeploy after setting variables.

The app includes email sign-up/sign-in and a manual cloud-sync control. After adding the two public Supabase values and running the SQL schema, open Settings → Cloud account & sync, create an account or sign in, then export a backup and press Sync. Local records are uploaded first and the signed-in account's records are then downloaded. The anon key is safe to expose only because every table has Row Level Security; never use a service-role key in the browser.

## 4. Meta / Facebook access

A Meta developer app, business verification where required, app review, Page permissions, Page access token and webhook configuration may be required. Meta's Page API documents that Page data access depends on granted permissions or approved public-access features. Webhooks also respect the permissions and access granted by the Page owner.

Arbitrary personal-profile monitoring is not available as a general-purpose public API. This app must not ask for Facebook passwords, session cookies or browser login tokens. The manual post-link workflow remains available.

## 5. Test checklist

- Add, edit, search, pause and remove a creator.
- Add a post with a caption and confirm duplicate URLs are rejected.
- Edit and save a comment, copy it, then confirm it is published only after manual posting.
- Verify skipped and dismissed posts remain in History.
- Export a backup, clear test data, then import it.
- With Vercel env configured, check Settings → AI connection and generate a comment.
- Test on an Android browser at mobile width.

## Current boundaries

No automatic Facebook discovery, scheduled scans, Meta OAuth/webhooks, direct comment publishing or cloud sync should be considered live until those features are separately implemented, configured and tested.
