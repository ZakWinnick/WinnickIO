export const FEED_URL = 'https://zakwinnick.com/feed.json';

export function htmlToText(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();
}

export function findFirstImage(html = '') {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

export function normalizeFeedItem(item = {}) {
  const text = htmlToText(item.content_html || item.content_text || '');
  const title = String(item.title || text || 'From ZakWinnick.com').trim();

  return {
    title,
    excerpt: text.slice(0, 180),
    image: item.image || item.banner_image || findFirstImage(item.content_html),
    url: item.url || item.external_url,
    date: item.date_published || item.date_modified,
  };
}

export async function fetchLatestPosts(fetchImpl = fetch, limit = 3) {
  const response = await fetchImpl(FEED_URL);
  if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);

  const feed = await response.json();
  const items = Array.isArray(feed.items) ? [...feed.items] : [];

  return items
    .sort((left, right) => {
      const leftDate = Date.parse(left.date_published || left.date_modified || 0) || 0;
      const rightDate = Date.parse(right.date_published || right.date_modified || 0) || 0;
      return rightDate - leftDate;
    })
    .slice(0, limit)
    .map(normalizeFeedItem);
}
