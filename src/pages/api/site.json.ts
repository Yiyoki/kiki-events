import { getPublishedEvents, apiEnvelope, SITE_NAME, SITE_DESCRIPTION, SITE_BASE_URL, jsonResponse } from '../../lib/miniapp-api';

export async function GET() {
  const events = await getPublishedEvents();
  const latest = events[0];
  return jsonResponse(apiEnvelope({
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    baseUrl: SITE_BASE_URL,
    author: 'KiKi喵',
    latestEvent: latest ? latest.id : null,
    endpoints: {
      events: '/api/events.json',
      categories: '/api/categories.json',
      dates: '/api/dates.json',
      eventDetailPattern: '/api/events/{id}.json',
    },
  }));
}
