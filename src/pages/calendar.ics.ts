import type { APIRoute } from 'astro';
import { loadEvents, toICS } from '../lib/events';

export const GET: APIRoute = async () => {
  const events = await loadEvents();
  return new Response(toICS(events), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="launch-point.ics"',
    },
  });
};
