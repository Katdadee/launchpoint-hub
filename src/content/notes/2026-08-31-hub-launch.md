---
title: "Hub Launch — How to Use This Site"
date: 2026-08-31
location: "Online"
notetaker: "Antonio McCarver"
attendees:
  - Antonio McCarver
summary: "The Launch Point Hub is live. This note doubles as a quick guide for the group. Replace or delete it once real meeting notes exist."
decisions:
  - The group will use the Hub as the single place for the schedule, Zoom link, documents, and notes.
actionItems:
  - task: "Share the Hub link with every group member"
    owner: "Antonio McCarver"
    due: 2026-09-10
    done: false
  - task: "Create the recurring Zoom meeting and paste the link into src/config.ts"
    owner: "Antonio McCarver"
    due: 2026-09-05
    done: true
  - task: "Create the shared Google Drive folder and add its ID to src/config.ts"
    owner: "Antonio McCarver"
    due: 2026-09-05
    done: true
nextMeeting: "To be scheduled — see calendar"
draft: false
---

## What this site is for

Everything the group needs, one click away:

- **Join the meeting** — the big green button at the top always points to the next meeting's Zoom.
- **Calendar** — every meeting and deadline. Click a day to see details. Use *Subscribe* to add the whole schedule to your phone.
- **Documents** — anything we create. Click to open, use the download arrow to save a copy.
- **Meeting notes** — what we discussed, what we decided, and who owns what next.

## For whoever runs the hub

Adding things is a matter of editing a small text file and pushing to GitHub — the site rebuilds itself in about a minute:

| To… | Edit… |
| --- | --- |
| Add a meeting | `src/content/data/events.json` |
| Add a document | `src/content/data/documents.json` (or just drop it in the Drive folder) |
| Write notes | `npm run note -- 2026-09-10`, fill in, set `draft: false` |
| Change the Zoom link, roster, or deliverable status | `src/config.ts` |
