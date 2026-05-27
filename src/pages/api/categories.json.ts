import { getPublishedEvents, eventListItem, apiEnvelope, jsonResponse } from '../../lib/miniapp-api';

export async function GET() {
  const events = await getPublishedEvents();
  const categories = new Map<string, ReturnType<typeof eventListItem>[]>();
  for (const event of events) {
    const item = eventListItem(event);
    const bucket = categories.get(item.category) ?? [];
    bucket.push(item);
    categories.set(item.category, bucket);
  }

  return jsonResponse(apiEnvelope({
    items: [...categories.entries()].map(([name, items]) => ({
      name,
      count: items.length,
      events: items.map((item) => item.id),
    })),
  }));
}
