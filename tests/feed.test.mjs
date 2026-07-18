import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FEED_URL,
  htmlToText,
  findFirstImage,
  normalizeFeedItem,
  fetchLatestPosts,
} from '../feed.js';

test('uses the approved feed URL', () => {
  assert.equal(FEED_URL, 'https://zakwinnick.com/feed.json');
});

test('normalizes titleless posts and strips HTML safely', () => {
  const post = normalizeFeedItem({
    url: 'https://zakwinnick.com/post',
    date_published: '2026-07-17T10:00:00-07:00',
    content_html: '<p>Hello <strong>world</strong>.</p><img src="https://example.com/photo.jpg">',
  });
  assert.equal(post.title, 'Hello world.');
  assert.equal(post.excerpt, 'Hello world.');
  assert.equal(post.image, 'https://example.com/photo.jpg');
});

test('fetches only the requested number of newest posts', async () => {
  const fetchImpl = async () => ({
    ok: true,
    json: async () => ({ items: [
      { url: '/1', title: 'One', content_html: '', date_published: '2026-03-01' },
      { url: '/2', title: 'Two', content_html: '', date_published: '2026-02-01' },
      { url: '/3', title: 'Three', content_html: '', date_published: '2026-01-01' },
      { url: '/4', title: 'Four', content_html: '', date_published: '2025-12-01' },
    ] }),
  });
  const posts = await fetchLatestPosts(fetchImpl, 3);
  assert.equal(posts.length, 3);
  assert.equal(posts[0].title, 'One');
});

test('rejects failed feed responses', async () => {
  await assert.rejects(() => fetchLatestPosts(async () => ({ ok: false, status: 503 }), 3), /503/);
});
