import { getPublishedEvents, eventListItem, apiEnvelope, toIsoDate, jsonResponse } from '../../lib/miniapp-api';

export async function GET() {
  const events = await getPublishedEvents();
  const dates = new Map<string, ReturnType<typeof eventListItem>[]>();
  for (const event of events) {
    const item = eventListItem(event);
    const date = toIsoDate(event.data.eventDate);
    const bucket = dates.get(date) ?? [];
    bucket.push(item);
    dates.set(date, bucket);
  }

  return jsonResponse(apiEnvelope({
    items: [...dates.entries()].map(([date, items]) => ({
      date,
      count: items.length,
      events: items.map((item) => item.id),
    })),
  }));
}
