import { getCollection } from 'astro:content';
import { site } from '../config';

export type HubEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  start?: string; // HH:MM
  end?: string;
  location?: string;
  inPerson: boolean;
  description?: string;
  type: 'meeting' | 'deadline' | 'event' | 'lc';
  joinUrl: string; // resolved zoom link ('' if none)
  startISO: string; // local wall-clock ISO without offset e.g. 2026-09-10T18:00:00
  endISO: string;
};

export async function loadEvents(): Promise<HubEvent[]> {
  const raw = await getCollection('events');
  return raw
    .map(({ data: e }) => {
      const start = e.start ?? '00:00';
      const end = e.end ?? (e.start ? addMinutes(e.start, 60) : '23:59');
      return {
        id: e.id,
        title: e.title,
        date: e.date,
        start: e.start,
        end: e.end,
        location: e.location,
        inPerson: e.inPerson,
        description: e.description,
        type: e.type,
        joinUrl: e.zoom ?? site.zoomUrl, // remote option is always offered, even for in-person meetings
        startISO: `${e.date}T${start}:00`,
        endISO: `${e.date}T${end}:00`,
      } satisfies HubEvent;
    })
    .sort((a, b) => a.startISO.localeCompare(b.startISO));
}

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t / 60) % 24).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/* ---------- formatting (server side; client mirrors these in Calendar.astro) ---------- */

const dateFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const shortFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Format a YYYY-MM-DD as a long date (treats the date as a calendar date, no TZ drift). */
export function longDate(ymd: string): string {
  return dateFmt.format(new Date(`${ymd}T00:00:00Z`));
}
export function shortDate(ymd: string): string {
  return shortFmt.format(new Date(`${ymd}T00:00:00Z`));
}
export function time12(hhmm?: string): string {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hh}:${String(m).padStart(2, '0')} ${suffix}` : `${hh} ${suffix}`;
}
export function timeRange(e: { start?: string; end?: string }): string {
  if (!e.start) return 'All day';
  return e.end ? `${time12(e.start)} – ${time12(e.end)} CT` : `${time12(e.start)} CT`;
}

/** Google Calendar "add this event" link. */
export function googleCalLink(e: HubEvent): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates: `${compact(e.startISO)}/${compact(e.endISO)}`,
    ctz: site.timeZone,
    details: [e.description ?? '', e.joinUrl ? `Join Zoom: ${e.joinUrl}` : ''].filter(Boolean).join('\n\n'),
    location: e.joinUrl && !e.inPerson ? e.joinUrl : e.location ?? '',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
const compact = (iso: string) => iso.replace(/[-:]/g, '');

/* ---------- iCalendar feed ---------- */
export function toICS(events: HubEvent[]): string {
  const esc = (s = '') => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.programName}//${site.projectName} Hub//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(`${site.projectName} — ${site.programName}`)}`,
    `X-WR-TIMEZONE:${site.timeZone}`,
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'TZNAME:CDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'TZNAME:CST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
  for (const e of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@launchpoint-hub`,
      `DTSTAMP:${stamp}`,
      e.start ? `DTSTART;TZID=${site.timeZone}:${compact(e.startISO)}` : `DTSTART;VALUE=DATE:${e.date.replace(/-/g, '')}`,
      e.start ? `DTEND;TZID=${site.timeZone}:${compact(e.endISO)}` : `DTEND;VALUE=DATE:${nextDay(e.date)}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc([e.description ?? '', e.joinUrl ? `Join Zoom: ${e.joinUrl}` : ''].filter(Boolean).join('\n\n'))}`,
      `LOCATION:${esc(e.joinUrl && !e.inPerson ? e.joinUrl : e.location ?? '')}`,
      ...(e.joinUrl ? [`URL:${e.joinUrl}`] : []),
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
function nextDay(ymd: string) {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}
function fold(line: string) {
  // RFC 5545: lines ≤ 75 octets, continuation lines start with a space
  const out: string[] = [];
  let s = line;
  while (s.length > 73) {
    out.push(s.slice(0, 73));
    s = ' ' + s.slice(73);
  }
  out.push(s);
  return out.join('\r\n');
}
