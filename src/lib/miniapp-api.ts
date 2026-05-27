import { getCollection, type CollectionEntry } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getMascotForCategory } from './mascot';

export const SITE_NAME = 'KiKi大事报';
export const SITE_DESCRIPTION = '事件分析新闻稿档案，按事件、日期和类别索引。';
export const SITE_BASE_URL = 'https://kiki-events.pages.dev';

type EventEntry = CollectionEntry<'events'>;

export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function toIsoDateTime(value?: Date): string | null {
  return value ? value.toISOString() : null;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, SITE_BASE_URL).toString();
}

export async function getPublishedEvents(): Promise<EventEntry[]> {
  const events = await getCollection('events');
  return events
    .filter((event) => !event.data.draft)
    .sort((a, b) => b.data.eventDate.valueOf() - a.data.eventDate.valueOf());
}

export function eventListItem(event: EventEntry) {
  const mascot = getMascotForCategory(event.data.category, event.id);
  return {
    id: event.id,
    title: event.data.title,
    deck: event.data.deck,
    eventDate: toIsoDate(event.data.eventDate),
    publishedAt: toIsoDateTime(event.data.publishedAt),
    updatedAt: toIsoDateTime(event.data.updatedAt),
    category: event.data.category,
    tags: event.data.tags,
    region: event.data.region ?? null,
    severity: event.data.severity ?? null,
    author: event.data.author,
    cover: mascot.src,
    coverAbsolute: absoluteUrl(mascot.src),
    coverAlt: mascot.alt,
    apiUrl: `/api/events/${event.id}.json`,
    apiUrlAbsolute: absoluteUrl(`/api/events/${event.id}.json`),
    webUrl: `/events/${event.id}/`,
    webUrlAbsolute: absoluteUrl(`/events/${event.id}/`),
  };
}

async function markdownToHtml(body: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(body);
  return String(file);
}

export async function eventDetail(event: EventEntry) {
  return {
    ...eventListItem(event),
    sources: event.data.sources,
    content: {
      format: 'html' as const,
      html: await markdownToHtml(event.body),
    },
  };
}

export function apiEnvelope<T>(data: T) {
  return {
    site: {
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      baseUrl: SITE_BASE_URL,
    },
    generatedAt: new Date().toISOString(),
    ...data,
  };
}

export function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
