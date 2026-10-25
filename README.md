# ZERO Revision Notes

A small, free tool for editors and clients to turn scattered video feedback into one clear review sheet.

**[Use the live tool](https://zero-revision-notes.syrupyyew3.chatgpt.site/)**

Add a clip ID, version, timecode and specific requested change. Copy the finished sheet or download it as a text file. No signup, video upload or paid service is required.

## Features

- Multiple revision notes with required-change, preference and question categories.
- Optional project title and final approver.
- Validated `mm:ss` and `hh:mm:ss` timecodes; leave blank for whole-clip feedback.
- Incomplete-note detection before export.
- Remove and undo, clipboard copy with manual fallback, and TXT export.
- Fictional worked example, downloadable feedback guide and short captioned tutorial.
- Browser-local processing. No analytics SDK, external scripts, accounts or server needed.

Your notes are temporary: copy or download before refreshing or closing the page. The hosting service may keep ordinary access logs. Never paste real client information into public GitHub issues.

## Run locally

With Python 3 installed, run this from the project folder:

```sh
python -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. Serve over HTTP rather than opening `index.html` directly because the app uses JavaScript modules.

## Run checks

With Node.js installed:

```sh
node --check dist/app.js
node check.mjs
node check-assets.mjs
```

No package installation or API key is required. GitHub Actions runs these checks on pushes and pull requests. Cloud CI results are only confirmed after the workflow actually runs.

## Project files

| File | Purpose |
| --- | --- |
| `dist/index.html` | Accessible form, output sheet and guide |
| `dist/app.js` | Form interactions and exports |
| `dist/logic.mjs` | Timecode validation and review-sheet formatting |
| `dist/style.css` | Responsive layout and visual design |
| `dist/feedback-guide.md` | Client-facing free guide |
| `check.mjs` | Logic checks |
| `check-assets.mjs` | Local resource and secret-boundary checks |

## Example note

```text
C01 | v01 | 00:03
Required change
Remove the greeting and open with the phone-ordering close-up.
```

The example cafe in the app is fictional, not a real customer or testimonial.

## Feedback and contributions

Use the issue templates to report a bug or describe a workflow problem. Include what you tried, what you expected, and what happened. Use invented clip names and text; remove client details from screenshots.

Small improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## Scope and status

This is an early Project ZERO experiment, developed with AI assistance. It has no video player, timeline annotations, cloud storage, billing or claim of proven customer outcomes. The tutorial uses a computer-generated voice and fictional data.

This repository covers the free tool and included resources only. The separate Shortform Review Kit is not part of this repository.

## License

MIT. See [LICENSE](LICENSE).
