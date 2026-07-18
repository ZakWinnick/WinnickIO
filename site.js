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

function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'feed-card';

  const postUrl = safeUrl(post.url);
  if (!postUrl) return article;

  if (post.image) {
    const imageUrl = safeUrl(post.image);
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      article.append(image);
    }
  }

  const content = document.createElement('div');
  content.className = 'feed-card-content';

  if (post.date) {
    const date = new Date(post.date);
    if (!Number.isNaN(date.valueOf())) {
      const time = document.createElement('time');
      time.dateTime = post.date;
      time.textContent = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
      content.append(time);
    }
  }

  const link = document.createElement('a');
  link.href = postUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const title = document.createElement('h3');
  title.textContent = post.title;
  link.append(title);
  content.append(link);

  if (post.excerpt && post.excerpt !== post.title) {
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;
    content.append(excerpt);
  }

  const arrow = document.createElement('i');
  arrow.className = 'fa-solid fa-arrow-up-right-from-square';
  arrow.setAttribute('aria-hidden', 'true');
  content.append(arrow);

  article.append(content);
  return article;
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
    feedGrid.replaceChildren(...posts.map(createPostCard));
  } catch {
    feedGrid.replaceChildren(createFeedFallback());
  } finally {
    feedGrid.setAttribute('aria-busy', 'false');
  }
}

loadFeed();
