import fs from 'node:fs';
import path from 'node:path';

const dist = process.argv[2] || 'dist';
const requiredFiles = [
  'api/site.json',
  'api/events.json',
  'api/categories.json',
  'api/dates.json',
];

function readJson(rel) {
  const p = path.join(dist, rel);
  if (!fs.existsSync(p)) throw new Error(`missing ${rel}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const site = readJson('api/site.json');
assert(site.name === 'KiKi大事报', 'site.name mismatch');
assert(typeof site.baseUrl === 'string' && site.baseUrl.startsWith('https://'), 'site.baseUrl must be https');

const events = readJson('api/events.json');
assert(Array.isArray(events.items), 'events.items must be array');
assert(events.items.length > 0, 'events.items empty');
for (const item of events.items) {
  assert(item.id && item.title && item.deck, `event list item missing core fields: ${item.id}`);
  assert(item.apiUrl === `/api/events/${item.id}.json`, `apiUrl mismatch for ${item.id}`);
  assert(item.webUrl === `/events/${item.id}/`, `webUrl mismatch for ${item.id}`);
  assert(item.cover && item.cover.startsWith('/images/'), `cover should be site-relative image path for ${item.id}`);
  assert(item.coverAbsolute && item.coverAbsolute.startsWith('https://'), `coverAbsolute missing for ${item.id}`);
  const detail = readJson(`api/events/${item.id}.json`);
  assert(detail.id === item.id, `detail id mismatch for ${item.id}`);
  assert(detail.content && detail.content.format === 'html', `detail content format mismatch for ${item.id}`);
  assert(typeof detail.content.html === 'string' && detail.content.html.includes('<'), `detail html missing for ${item.id}`);
  assert(Array.isArray(detail.sources), `sources must be array for ${item.id}`);
}

const categories = readJson('api/categories.json');
assert(Array.isArray(categories.items), 'categories.items must be array');
assert(categories.items.every(x => x.name && Number.isInteger(x.count)), 'bad category item');

const dates = readJson('api/dates.json');
assert(Array.isArray(dates.items), 'dates.items must be array');
assert(dates.items.every(x => /^\d{4}-\d{2}-\d{2}$/.test(x.date) && Array.isArray(x.events)), 'bad date item');

console.log(JSON.stringify({ ok: true, events: events.items.length, categories: categories.items.length, dates: dates.items.length }, null, 2));
