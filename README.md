# Launch Point Hub

The one-link dashboard for the **Leadership Clarksville** study group working on
**Launch Point: Youth Transition to Independence** (Sep 2026 – May 2027).

Built for non-technical group members: open the link, hit **Join Zoom Meeting**. Everything else —
calendar, documents, meeting notes, action items, the project brief — is one scroll away.

## For group members

| I want to… | Do this |
| --- | --- |
| Join the meeting | Click the big green **Join Zoom Meeting** button at the top. |
| See the schedule | Scroll to **Calendar**. Click any meeting for details. |
| Put every meeting on my phone | Click **Subscribe / add all to my calendar**. |
| Find or download a document | Scroll to **Documents**. Click to open; ⬇ to download. |
| Read what we decided | **Meeting Notes** in the top menu. Each note has a **Print / Save as PDF** button. |
| See what I owe the group | **Open action items** on the home page (sorted by due date, overdue in red). |

## For the hub admin (Antonio)

Everything is a small text file. Edit → commit → push → Cloudflare rebuilds in ~1 minute.

| To… | Edit… |
| --- | --- |
| Set the Zoom link, roster, deliverable status, project dates | `src/config.ts` |
| Point the Documents section at the shared Drive folder | `driveFolderId` in `src/config.ts` |
| Add / change a meeting or deadline | `src/content/data/events.json` |
| Add a document to the curated list | `src/content/data/documents.json` |
| Write meeting notes | `npm run note -- 2026-09-10` → fill in `src/content/notes/2026-09-10.md` → set `draft: false` |

### Meeting-notes workflow (the fast way)

1. During the meeting, take rough notes anywhere (paper, phone, Zoom AI summary).
2. Afterwards: `npm run note -- YYYY-MM-DD`, paste the rough notes under **Discussion**, fill in
   `attendees`, `decisions`, and `actionItems` (task / owner / due) in the front-matter.
3. Set `draft: false`, commit, push. The note appears in the archive and every action item rolls
   up onto the home page automatically. Mark items `done: true` as they close.

Tip: paste rough notes into Claude with "format these into the Launch Point note template" and it
will produce the whole file.

### Events format

```json
{
  "id": "2026-09-10-kickoff",          // unique, stable — used for calendar subscriptions
  "title": "Kickoff Meeting",
  "date": "2026-09-10",                // YYYY-MM-DD
  "start": "18:00", "end": "19:30",    // 24-hour, Central Time; omit for all-day
  "location": "Zoom",
  "inPerson": false,                   // true hides the Join button and shows the location
  "zoom": "https://…",                 // optional — overrides the group link for this meeting
  "description": "…",
  "type": "meeting"                    // meeting | deadline | lc | event
}
```

### Documents

Two ways, use both:
- **Zero-effort:** drop files into the shared Google Drive folder. The folder is embedded live on the page.
- **Curated:** add an entry to `documents.json` with `featured: true` for the important few (the plan
  draft, the interview guide, etc.). Google Drive / Docs / Sheets / Slides links get an automatic
  **Download** button.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
```

## Deploy (Cloudflare Workers, free)

The site deploys as a Cloudflare Worker with static assets, the same way cciegrind.com does.
`wrangler.jsonc` in the repo root holds the deploy settings.

One-time connection in the Cloudflare dashboard:

1. **Workers & Pages → Create → Import a repository** → pick `Katdadee/launchpoint-hub`.
2. Build command `npm run build`, deploy command `npx wrangler deploy`.
3. Save and deploy. Share the `launchpoint-hub.<account>.workers.dev` URL with the group.

Every push to `main` redeploys automatically.
