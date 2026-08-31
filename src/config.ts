/**
 * ONE-STOP SETTINGS FILE.
 * Everything a group lead needs to change lives here. Edit, save, push — the site rebuilds.
 */
export const site = {
  programName: 'Leadership Clarksville',
  cohort: 'Class of 2027',
  projectName: 'Launch Point',
  projectTagline: 'Youth Transition to Independence',
  // Central Time — Clarksville, TN
  timeZone: 'America/Chicago',

  /**
   * The ONE Zoom link the group uses for every meeting.
   * Tip: in Zoom, create a "Recurring meeting / No fixed time" so this link never changes.
   * Individual meetings in events.json can override it with their own "zoom" field.
   */
  zoomUrl: '',

  /**
   * Google Drive shared folder that holds the group's documents & collateral.
   * 1) Create a folder in Drive  2) Share → "Anyone with the link" → Viewer
   * 3) Copy the ID from the URL: drive.google.com/drive/folders/<THIS-PART>
   */
  driveFolderId: '',

  // Who to contact when something on the hub is wrong or missing.
  hubOwner: { name: 'Antonio McCarver', role: 'Notes & Hub' },

  // Project window
  projectStart: '2026-09-01',
  projectEnd: '2027-05-31',
};

/** Group roster. Add everyone — a phone/email is optional but helps non-technical members. */
export const team: { name: string; role: string; org?: string; email?: string; phone?: string }[] = [
  { name: 'Antonio McCarver', role: 'Meeting notes · Hub admin', org: 'RDU Ventures' },
  // { name: 'Jane Doe', role: 'Group lead', org: 'Organization', email: 'jane@example.com' },
];

/**
 * The nine deliverables named in the LC project brief.
 * status: 'not-started' | 'in-progress' | 'done'
 */
export const deliverables: { title: string; status: 'not-started' | 'in-progress' | 'done'; owner?: string; note?: string }[] = [
  { title: 'Recommended service model', status: 'not-started', note: 'Physical center, coordinated network, or hybrid' },
  { title: 'Potential facility / location options', status: 'not-started' },
  { title: 'Partnership structure', status: 'not-started', note: 'Local gov, schools, APSU, DCS, Juvenile Court, providers, nonprofits, faith groups' },
  { title: 'Referral process', status: 'not-started' },
  { title: 'Estimated costs', status: 'not-started' },
  { title: 'Potential funding sources', status: 'not-started' },
  { title: 'Mentoring & support strategies', status: 'not-started', note: 'Build on Juvenile Court + APSU mentoring partnership' },
  { title: 'Measurable outcomes', status: 'not-started' },
  { title: 'Phased timeline for launch & expansion', status: 'not-started' },
];

/** Proposed 9-month roadmap. Adjust as the group agrees on its plan. */
export const phases: { name: string; months: string; start: string; end: string; focus: string[] }[] = [
  {
    name: 'Kickoff & Discovery',
    months: 'Sep – Oct 2026',
    start: '2026-09-01', end: '2026-10-31',
    focus: ['Agree on roles, cadence & tools', 'Map existing youth-serving resources in Montgomery County', 'Identify stakeholders to interview'],
  },
  {
    name: 'Stakeholder Research',
    months: 'Nov – Dec 2026',
    start: '2026-11-01', end: '2026-12-31',
    focus: ['Interviews: DCS, Juvenile Court, APSU, schools, housing & behavioral-health providers', 'Listen to young adults with lived experience', 'Document service gaps'],
  },
  {
    name: 'Analysis & Model Design',
    months: 'Jan – Feb 2027',
    start: '2027-01-01', end: '2027-02-28',
    focus: ['Compare physical vs. network vs. hybrid models', 'Scope housing need & location options', 'Draft cost estimate and funding map'],
  },
  {
    name: 'Draft the Plan',
    months: 'Mar – Apr 2027',
    start: '2027-03-01', end: '2027-04-30',
    focus: ['Write the implementation plan', 'Referral process, mentoring strategy, outcomes', 'Review with key partners'],
  },
  {
    name: 'Finalize & Present',
    months: 'May 2027',
    start: '2027-05-01', end: '2027-05-31',
    focus: ['Final edits & design', 'Presentation to Leadership Clarksville', 'Hand-off to community partners'],
  },
];
