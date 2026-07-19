import { fetchLatestPosts } from './feed.js';

const feedGrid = document.querySelector('#feed-grid');

function safeUrl(value, base = 'https://zakwinnick.com/') {
  try {
    const url = new URL(value, base);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function appendPostImage(container, post) {
  const imageUrl = safeUrl(post.image);
  if (!imageUrl) return;
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  container.append(image);
}

function appendPostDate(container, post) {
  if (!post.date) return;
  const date = new Date(post.date);
  if (Number.isNaN(date.valueOf())) return;
  const time = document.createElement('time');
  time.className = 'date';
  time.dateTime = post.date;
  time.textContent = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
  container.append(time);
}

function createPost(post, index) {
  const postUrl = safeUrl(post.url);
  if (!postUrl) return null;

  const link = document.createElement('a');
  link.className = index === 0 ? 'feature-post' : 'small-post';
  link.href = postUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  appendPostImage(link, post);
  appendPostDate(link, post);

  const title = document.createElement('h3');
  title.textContent = post.title;
  link.append(title);

  if (post.excerpt && post.excerpt !== post.title) {
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;
    link.append(excerpt);
  }

  return link;
}

function createFeedFallback() {
  const fallback = document.createElement('a');
  fallback.className = 'feed-fallback';
  fallback.href = 'https://zakwinnick.com/';
  fallback.target = '_blank';
  fallback.rel = 'noopener noreferrer';
  fallback.textContent = 'Visit ZakWinnick.com';
  return fallback;
}

async function loadFeed() {
  if (!feedGrid) return;
  try {
    const posts = await fetchLatestPosts();
    if (!posts.length) throw new Error('Feed is empty');
    const elements = posts.map(createPost).filter(Boolean);
    if (!elements.length) throw new Error('Feed has no valid links');

    const feature = elements[0];
    const secondary = document.createElement('div');
    secondary.className = 'small-posts';
    secondary.append(...elements.slice(1));
    feedGrid.replaceChildren(feature, secondary);
  } catch {
    feedGrid.replaceChildren(createFeedFallback());
  } finally {
    feedGrid.setAttribute('aria-busy', 'false');
  }
}

for (const year of document.querySelectorAll('[data-copyright-year]')) {
  year.textContent = String(new Date().getFullYear());
}

loadFeed();
