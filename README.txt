# Creator Support AI — prototype

## Run it
- Extract the ZIP.
- Open `index.html` in a modern browser, or upload the files to a static host such as GitHub Pages.
- Data is stored locally in the browser using localStorage.

## Included
- Save Facebook personal-profile and Page links.
- Add a Reel/post URL with caption, topic and video description/transcript.
- Generate a contextual sample comment with India/festival-aware examples.
- Edit and approve the comment.
- `SEND COMMENT` copies the comment and opens the original Facebook URL.

## Important prototype limits
This is a front-end prototype, not a connected AI service or Facebook integration:
- It does not automatically monitor Facebook accounts.
- It cannot fetch/watch Facebook videos or transcribe their audio by itself.
- The sample comment generator uses simple local rules, not a language model.
- Facebook may not allow third-party apps to prefill the comment composer. The reliable fallback is clipboard copy + opening the post; the user pastes and taps Post.
- Direct monitoring, Hindi speech transcription, video understanding and any direct publishing require a secure backend, an AI provider, media supplied through permitted means, and Meta-approved permissions. Do not collect Facebook passwords or automate browser sessions.
