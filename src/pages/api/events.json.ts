import { getPublishedEvents, eventListItem, apiEnvelope, jsonResponse } from '../../lib/miniapp-api';

export async function GET() {
  const events = await getPublishedEvents();
  return jsonResponse(apiEnvelope({
    count: events.length,
    items: events.map(eventListItem),
  }));
}
