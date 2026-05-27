import type { GetStaticPaths } from 'astro';
import { getPublishedEvents, eventDetail, apiEnvelope, jsonResponse } from '../../../lib/miniapp-api';

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getPublishedEvents();
  return events.map((event) => ({ params: { slug: event.id }, props: { event } }));
};

export async function GET({ props }: { props: any }) {
  const detail = await eventDetail(props.event);
  return jsonResponse(apiEnvelope(detail));
}
