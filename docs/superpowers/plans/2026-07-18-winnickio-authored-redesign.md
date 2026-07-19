# WinnickIO Authored Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected bold implementation with the approved authored homepage and editorial résumé while preserving the live feed, complete career history, automatic themes, and static GitHub Pages architecture.

**Architecture:** Keep the existing two-page static site and its shared CSS/JavaScript boundaries. Rebuild the homepage and résumé markup around the approved authored layouts, retain `feed.js` as the pure feed-normalization module, and update `site.js` only for safe feed DOM rendering and the dynamic copyright year.

**Tech Stack:** Semantic HTML5, CSS custom properties, ES modules, Node.js `node:test`, Font Awesome 6, Google Fonts, GitHub Pages-compatible static hosting.

## Global Constraints

- Preserve `hawaii.html`, but do not link to it or include Hawaii content in the rebuilt site.
- Keep the site framework-free and compatible with GitHub Pages.
- Use DM Sans and Instrument Serif. Remove Archivo Black from the primary hierarchy.
- Use a thin 8–12px Signal Orange edge accent without visible `ZW` lettering.
- Light tokens: background `#f7f5ef`, foreground `#1f211d`, muted `#62645c`, accent `#ef5b36`.
- Dark tokens: background `#23231f`, surface `#292925`, foreground `#f1ede4`, muted `#bcb8ae`, accent `#ff7048`.
- Theme follows `prefers-color-scheme`; do not add a manual theme toggle.
- Homepage navigation remains `Profile`, `Now`, `Résumé`, `Elsewhere`.
- Homepage order remains Hero, Profile, Career, Right Now, Elsewhere, ZakWinnick.com feed, Connect.
- Rangeway and NorCal EVs receive equal visual weight in Right Now.
- Elsewhere public order remains ZakWinnick.com, Current Heading, NorCal EVs, Bay Area Rivian Club.
- Never abbreviate Bay Area Rivian Club as `BARC` in visible copy.
- Feed URL remains `https://zakwinnick.com/feed.json`; display the newest three posts regardless of category.
- Render feed content with safe DOM APIs; never assign feed content through `innerHTML`.
- Display the full image for every feed item that contains an image; do not crop or letterbox it.
- Connect contains Email, LinkedIn, X, and Instagram with Font Awesome icons.
- Both page footers contain only `© [dynamic year] Zak Winnick`.
- External links open in a new tab with `rel="noopener noreferrer"` unless the link is email.
- Complete and verify locally. Do not deploy until Zak explicitly approves the implementation.

---

## File Structure

- `index.html` — approved authored homepage markup and exact public copy
- `resume.html` — complete editorial résumé and approved external links
- `styles.css` — shared theme, typography, homepage, résumé, responsive, focus, and reduced-motion styles
- `site.js` — dynamic year and safe feed-card rendering
- `feed.js` — unchanged public feed interface unless a verification defect requires a focused fix
- `tests/site-contract.test.mjs` — exact content, order, link, theme, and safe-rendering contracts
- `tests/feed.test.mjs` — feed URL, normalization, ordering, and response-failure tests

## Shared Interfaces

`feed.js` retains:

```js
export const FEED_URL = 'https://zakwinnick.com/feed.json';
export function htmlToText(html = '') {}
export function findFirstImage(html = '') {}
export function normalizeFeedItem(item = {}) {}
export async function fetchLatestPosts(fetchImpl = fetch, limit = 3) {}
```

`site.js` consumes `fetchLatestPosts()` and renders into:

```html
<div id="feed-grid" class="post-layout" aria-live="polite" aria-busy="true"></div>
```

It also populates every dynamic-year target:

```html
<span data-copyright-year>2026</span>
```

---

### Task 1: Rebuild the homepage around the approved authored structure

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: existing shared page shell, `#feed-grid`, and `site.js` module loading.
- Produces: final homepage section DOM and CSS classes consumed by Task 2.

- [ ] **Step 1: Replace the rejected homepage contracts with approved authored contracts**

Keep the shared `read()` helper and résumé tests. Replace rejected homepage-layout assertions and append:

```js
test('homepage uses the approved name-first hero', async () => {
  const home = await read('index.html');
  assert.equal((home.match(/<h1/g) ?? []).length, 1);
  assert.match(home, /<h1[^>]*>Zak Winnick<\/h1>/);
  assert.match(home, /class="tagline"[^>]*>Technology\. Hospitality\. People\.<\/p>/);
  assert.match(home, /images\/profile-bw\.jpg/);
  assert.doesNotMatch(home, /<h1[^>]*>Technology\./);
  assert.doesNotMatch(home, /portrait-marker|Systems · Service · Community/);
});

test('homepage reads as an authored page rather than numbered modules', async () => {
  const home = await read('index.html');
  for (const heading of ['Profile', 'Career', 'Right now', 'Other places you’ll find me']) {
    assert.ok(home.includes(heading), heading);
  }
  assert.doesNotMatch(home, /class="section-label"/);
  assert.doesNotMatch(home, /class="career-path"/);
  assert.doesNotMatch(home, /Two ways of building better journeys|There’s more than one thread/);
});

test('current roles use exact approved hierarchy and copy', async () => {
  const home = await read('index.html');
  assert.equal((home.match(/class="role"/g) ?? []).length, 2);
  assert.match(home, /Building the places/);
  assert.match(home, /Founder &amp; Chief Executive Officer/);
  assert.match(home, /Bringing together the people/);
  assert.match(home, /Executive Director/);
  assert.match(home, /community for EV owners across every brand/);
  assert.ok(home.includes('https://rangeway.co/'));
  assert.ok(home.includes('https://norcalevs.org/'));
});

test('elsewhere uses approved prose, order, and role hierarchy', async () => {
  const home = await read('index.html');
  const elsewhere = home.slice(home.indexOf('id="elsewhere"'), home.indexOf('id="posts"'));
  const names = ['ZakWinnick.com', 'Current Heading', 'NorCal EVs', 'Bay Area Rivian Club'];
  const positions = names.map((name) => elsewhere.indexOf(name));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
  assert.match(elsewhere, /I serve as Executive Director of/);
  assert.match(elsewhere, /I also serve on the board of the/);
  assert.match(elsewhere, /drives, meetups, hands-on learning, and service projects/);
  for (const href of [
    'https://zakwinnick.com',
    'https://currentheading.com',
    'https://norcalevs.org',
    'https://bayarearivianclub.com',
  ]) assert.ok(elsewhere.includes(href), href);
});

test('homepage footer contains only dynamic copyright content', async () => {
  const home = await read('index.html');
  const footer = home.slice(home.indexOf('<footer'), home.indexOf('</footer>') + 9);
  assert.match(footer, /©\s*<span data-copyright-year>2026<\/span>\s*Zak Winnick/);
  assert.doesNotMatch(footer, /Technology\. Hospitality\. People\./);
});
```

- [ ] **Step 2: Run the homepage contracts and verify they fail**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: the new hero, authored-layout, role-copy, Elsewhere-prose, and footer tests fail against the rejected implementation.

- [ ] **Step 3: Replace the homepage body with the approved semantic structure**

Keep the existing metadata, Google Fonts preconnects, Font Awesome stylesheet, shared stylesheet, and module script. Change the Google Fonts URL to load only DM Sans and Instrument Serif. Use this body structure and exact public copy:

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="edge-accent" aria-hidden="true"></div>

  <header class="site-header shell">
    <a class="nameplate" href="index.html" aria-label="Zak Winnick, home">Zak Winnick</a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="#profile">Profile</a>
      <a href="#now">Now</a>
      <a href="resume.html">Résumé</a>
      <a href="#elsewhere">Elsewhere</a>
    </nav>
  </header>

  <main id="main">
    <section class="hero shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow">Operator · Community builder · Technologist</p>
        <h1 id="hero-title">Zak Winnick</h1>
        <p class="tagline">Technology. Hospitality. People.</p>
        <p class="intro">I’ve spent my career making complex systems work better for the people who depend on them.</p>
        <a class="text-link" href="#profile">A little more about me <span aria-hidden="true">↓</span></a>
      </div>
      <div class="portrait">
        <img src="images/profile-bw.jpg" alt="Zak Winnick outdoors in the desert">
      </div>
    </section>

    <section id="profile" class="profile shell" aria-labelledby="profile-title">
      <h2 id="profile-title" class="plain-heading">Profile</h2>
      <p class="profile-lead">I’m a systems-minded operator and community builder who has spent more than two decades working at the intersection of technology, hospitality, and the people who rely on both.</p>
      <p class="profile-aside">I’m drawn to complicated environments, practical solutions, and work that makes someone’s day run a little better.</p>
    </section>

    <section id="career" class="career shell" aria-labelledby="career-title">
      <div class="career-layout">
        <h2 id="career-title">Career</h2>
        <div class="career-story">
          <p>Most of my work has happened behind the scenes, in the systems nobody notices until they stop working.</p>
          <p>My career has moved through hospitality, logistics, SaaS, fintech, and healthtech. Along the way, I’ve led IT operations, identity and access management, security and compliance programs, property technology, and the operational foundations behind growing teams.</p>
          <p>That experience now informs how I approach infrastructure and community leadership: understand the real operating environment, make the complicated parts dependable, and never lose sight of the person on the other side.</p>
          <a class="text-link" href="resume.html">Read the complete résumé <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section id="now" class="now" aria-labelledby="now-title">
      <div class="shell">
        <div class="now-header">
          <h2 id="now-title">Right now</h2>
          <p>My current work sits in two different parts of the EV world: the places drivers stop, and the community they find along the way.</p>
        </div>
        <div class="roles">
          <article class="role">
            <p class="role-context">Building the places</p>
            <h3>Rangeway</h3>
            <p class="role-title">Founder &amp; Chief Executive Officer</p>
            <p class="role-copy">I’m building a hospitality-driven premium EV charging network around reliability, comfort, and the real needs of long-distance drivers.</p>
            <a href="https://rangeway.co/" target="_blank" rel="noopener noreferrer">rangeway.co <span aria-hidden="true">↗</span></a>
          </article>
          <article class="role">
            <p class="role-context">Bringing together the people</p>
            <h3>NorCal EVs</h3>
            <p class="role-title">Executive Director</p>
            <p class="role-copy">I lead Northern California’s community for EV owners across every brand, creating events, education, and connections that make EV ownership more useful and welcoming.</p>
            <a href="https://norcalevs.org/" target="_blank" rel="noopener noreferrer">norcalevs.org <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </div>
    </section>

    <section id="elsewhere" class="elsewhere shell" aria-labelledby="elsewhere-title">
      <h2 id="elsewhere-title">Other places you’ll find me</h2>
      <div class="elsewhere-copy">
        <p>I write short posts, photos, and longer stories at <a href="https://zakwinnick.com" target="_blank" rel="noopener noreferrer">ZakWinnick.com</a>. <a href="https://currentheading.com" target="_blank" rel="noopener noreferrer">Current Heading</a> is my personal brand and home for independent projects. I serve as Executive Director of <a href="https://norcalevs.org" target="_blank" rel="noopener noreferrer">NorCal EVs</a>, Northern California’s community for EV owners across every brand. I also serve on the board of the <a href="https://bayarearivianclub.com" target="_blank" rel="noopener noreferrer">Bay Area Rivian Club</a>, helping create drives, meetups, hands-on learning, and service projects for local Rivian owners.</p>
      </div>
    </section>

    <section id="posts" class="writing" aria-labelledby="posts-title">
      <div class="shell">
        <div class="writing-header">
          <h2 id="posts-title">From <a href="https://zakwinnick.com/" target="_blank" rel="noopener noreferrer">ZakWinnick.com</a></h2>
          <a href="https://zakwinnick.com/" target="_blank" rel="noopener noreferrer">See everything I’ve posted <span aria-hidden="true">↗</span></a>
        </div>
        <div id="feed-grid" class="post-layout" aria-live="polite" aria-busy="true">
          <p class="feed-loading">Loading the latest posts…</p>
        </div>
      </div>
    </section>

    <section id="connect" class="connect" aria-labelledby="connect-title">
      <div class="shell">
        <div class="connect-row">
          <h2 id="connect-title">The internet is better when it leads to people.</h2>
          <div class="socials" aria-label="Social links">
            <a href="mailto:zak@winnick.io" aria-label="Email"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a>
            <a href="https://www.linkedin.com/in/zakwinnick" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
            <a href="https://x.com/ZakWinnick" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
            <a href="https://instagram.com/zakwinnick" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
          </div>
        </div>
        <footer class="site-footer">© <span data-copyright-year>2026</span> Zak Winnick</footer>
      </div>
    </section>
  </main>
</body>
```

- [ ] **Step 4: Replace rejected layout primitives with the approved shared visual foundation**

At the top of `styles.css`, use:

```css
:root {
  color-scheme: light dark;
  --bg: #f7f5ef;
  --surface: #eeece5;
  --fg: #1f211d;
  --muted: #62645c;
  --accent: #ef5b36;
  --rule: rgba(31, 33, 29, 0.2);
  --sans: "DM Sans", sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #23231f;
    --surface: #292925;
    --fg: #f1ede4;
    --muted: #bcb8ae;
    --accent: #ff7048;
    --rule: rgba(241, 237, 228, 0.18);
  }
}

.edge-accent {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  width: 10px;
  background: var(--accent);
}

.shell {
  width: min(1180px, calc(100% - 80px));
  margin-inline: auto;
}
```

Delete `.identity-rail`, `.section-label`, `.career-path`, `.now-card`, `.elsewhere-grid`, `.connect-grid`, and Archivo Black declarations. Implement the approved hero, authored sections, open roles, prose Elsewhere, social icons, and footer using the exact structural classes from Step 3. Preserve the approved visual values:

```css
.hero {
  display: grid;
  min-height: 690px;
  grid-template-columns: minmax(0, 1.15fr) minmax(330px, 0.85fr);
  align-items: center;
  gap: clamp(48px, 7vw, 96px);
  padding: 72px 0 84px;
}

.hero h1 {
  margin: 0 0 22px;
  font-size: clamp(54px, 5vw, 72px);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.tagline {
  margin: 0 0 32px;
  font-family: var(--serif);
  font-size: clamp(30px, 3vw, 40px);
  line-height: 1.08;
}

.portrait {
  position: relative;
  justify-self: end;
  width: min(100%, 430px);
}

.portrait::before {
  position: absolute;
  inset: 18px -18px -18px 18px;
  border: 1px solid var(--accent);
  content: "";
}

.portrait img {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 34%;
  filter: grayscale(1) contrast(1.03);
}

.roles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(50px, 8vw, 110px);
}

.role {
  padding-top: 28px;
  border-top: 2px solid var(--accent);
}

.writing-header h2 a {
  color: var(--accent);
  text-decoration-color: var(--accent);
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
}

.socials {
  display: flex;
  gap: 13px;
}

.socials a {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid var(--rule);
  font-size: 18px;
  text-decoration: none;
}
```

- [ ] **Step 5: Run the homepage contracts and verify they pass**

Run:

```bash
node --test tests/site-contract.test.mjs
git diff --check
```

Expected: all homepage contracts pass and the whitespace check has no output.

- [ ] **Step 6: Commit the authored homepage**

```bash
git add index.html styles.css tests/site-contract.test.mjs
git commit -m "Rebuild WinnickIO as an authored profile"
```

---

### Task 2: Render the asymmetric feed and dynamic copyright safely

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `tests/feed.test.mjs` only if live-feed verification exposes a normalization gap
- Modify: `site.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `fetchLatestPosts(fetchImpl, 3)` and homepage `#feed-grid` from Task 1.
- Produces: one `.feature-post` and two `.small-post` elements, full natural-proportion images, fallback link, and populated `[data-copyright-year]` targets.

- [ ] **Step 1: Add failing feed-rendering and dynamic-year contracts**

Append to `tests/site-contract.test.mjs`:

```js
test('feed section links ZakWinnick.com with the approved treatment', async () => {
  const home = await read('index.html');
  assert.match(home, /<h2[^>]*>From\s*<a href="https:\/\/zakwinnick\.com\/"[^>]*>ZakWinnick\.com<\/a><\/h2>/);
  const css = await read('styles.css');
  assert.match(css, /\.writing-header h2 a[\s\S]*color:\s*var\(--accent\)/);
  assert.match(css, /text-decoration-style:\s*dashed/);
});

test('feed images preserve their full natural proportions without letterboxing', async () => {
  const css = await read('styles.css');
  for (const selector of ['.feature-post img', '.small-post img']) {
    const start = css.indexOf(selector);
    assert.ok(start >= 0, selector);
    const block = css.slice(start, css.indexOf('}', start));
    assert.match(block, /width:\s*auto/);
    assert.match(block, /max-width:\s*100%/);
    assert.match(block, /height:\s*auto/);
    assert.doesNotMatch(block, /aspect-ratio|object-fit:\s*cover|background:/);
  }
});

test('site script uses safe DOM APIs, asymmetric classes, and dynamic year', async () => {
  const js = await read('site.js');
  assert.match(js, /document\.createElement/);
  assert.match(js, /\.textContent\s*=/);
  assert.doesNotMatch(js, /\.innerHTML\s*=/);
  assert.match(js, /feature-post/);
  assert.match(js, /small-post/);
  assert.match(js, /data-copyright-year/);
  assert.match(js, /new Date\(\)\.getFullYear\(\)/);
  assert.match(js, /Visit ZakWinnick\.com/);
});
```

- [ ] **Step 2: Run the new contracts and verify they fail**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: feed-class, natural-image, and dynamic-year assertions fail against the old renderer.

- [ ] **Step 3: Update the safe feed renderer and dynamic year**

Keep `safeUrl()` and safe element creation. Replace the card builder and loader with:

```js
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
```

- [ ] **Step 4: Add the approved asymmetric, no-crop image CSS**

```css
.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
  gap: clamp(34px, 6vw, 76px);
}

.feature-post,
.small-post {
  display: block;
  text-decoration: none;
}

.feature-post img {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 540px;
  filter: saturate(0.78);
}

.small-posts {
  display: flex;
  flex-direction: column;
}

.small-post {
  padding-bottom: 34px;
  border-bottom: 1px solid var(--rule);
}

.small-post + .small-post {
  padding-top: 34px;
}

.small-post img {
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 260px;
  margin-bottom: 18px;
  filter: saturate(0.78);
}
```

Do not add an image background or fixed aspect ratio.

- [ ] **Step 5: Run all feed and site tests**

Run:

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and the whitespace check has no output.

- [ ] **Step 6: Verify the real feed through the pure interface**

Run:

```bash
node --experimental-default-type=module -e "import {fetchLatestPosts} from './feed.js'; const posts=await fetchLatestPosts(); console.log(posts.length, posts.map(post => Boolean(post.image)));"
```

Expected: `3 [ true, true, true ]` for the current feed. If a future post legitimately lacks an image, require `3` items and verify every present image is preserved rather than fabricating one.

- [ ] **Step 7: Commit feed and dynamic-year behavior**

```bash
git add site.js styles.css tests/site-contract.test.mjs tests/feed.test.mjs
git commit -m "Render authored feed and dynamic footer"
```

---

### Task 3: Rebuild the complete editorial résumé

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `resume.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: shared header, theme, edge accent, typography, dashed-link treatment, and `[data-copyright-year]` behavior.
- Produces: complete linked résumé page with exact experience, education, skills, certifications, and publications.

- [ ] **Step 1: Add exact résumé order and link contracts**

Append:

```js
test('resume includes approved property, education, and publication links', async () => {
  const resume = await read('resume.html');
  for (const href of [
    'https://westinnashville.com',
    'https://www.opalcollection.com/nashville/',
    'https://canyons.edu',
    'https://www.voxer.com/assets/images/Westin-Case-Study.pdf',
    'https://podcast.rivianclubs.org',
    'https://podcast.rangeway.co',
  ]) assert.ok(resume.includes(href), href);
  assert.match(resume, /The Bobby Hotel \(now The Nash\)/);
});

test('resume skills use the exact approved alphabetical order', async () => {
  const resume = await read('resume.html');
  const skills = [
    'Community &amp; Nonprofit Leadership',
    'Device Lifecycle Management',
    'EV Charging Infrastructure',
    'Event &amp; Program Development',
    'Identity &amp; Access Management',
    'IT Operations',
    'Network &amp; Property Technology',
    'Operational Leadership',
    'SaaS Administration',
    'Security &amp; Compliance',
    'Site Development &amp; Utility Coordination',
    'Systems Integration',
    'Vendor &amp; Partner Management',
    'Workflow Automation',
  ];
  const skillSection = resume.slice(resume.indexOf('id="skills-title"'), resume.indexOf('id="certifications-title"'));
  const positions = skills.map((skill) => skillSection.indexOf(skill));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('resume certifications use exact approved order', async () => {
  const resume = await read('resume.html');
  const certifications = [
    'Creating EV Charging Hubs: Innovative Design',
    'FastTrack EV Charging Certification',
    'Master Electric Vehicle Tech: Software Skills',
    'Plug Into The Future — EV Charging Essentials',
    'Fora Certified Travel Advisor',
  ];
  const section = resume.slice(resume.indexOf('id="certifications-title"'), resume.indexOf('id="publications-title"'));
  const positions = certifications.map((item) => section.indexOf(item));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('resume footer contains only dynamic copyright content', async () => {
  const resume = await read('resume.html');
  const footer = resume.slice(resume.indexOf('<footer'), resume.indexOf('</footer>') + 9);
  assert.match(footer, /©\s*<span data-copyright-year>2026<\/span>\s*Zak Winnick/);
  assert.doesNotMatch(footer, /Technology\. Hospitality\. People\.|Return home/);
});
```

- [ ] **Step 2: Run the résumé contracts and verify they fail**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: property, education, publication, skill-order, certification-order, and footer contracts fail.

- [ ] **Step 3: Replace the résumé shell with the approved editorial layout**

Preserve all eight existing full experience narratives and accomplishments from the July 17 LinkedIn-derived implementation. Change the page structure to:

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="edge-accent" aria-hidden="true"></div>
  <header class="site-header shell">
    <a class="nameplate" href="index.html" aria-label="Zak Winnick, home">Zak Winnick</a>
    <nav class="site-nav" aria-label="Primary navigation">
      <a href="index.html#profile">Profile</a>
      <a href="index.html#now">Now</a>
      <a href="resume.html" aria-current="page">Résumé</a>
      <a href="index.html#elsewhere">Elsewhere</a>
    </nav>
  </header>

  <main id="main">
    <section class="resume-intro shell">
      <h1>Résumé</h1>
      <div class="resume-summary">
        <p>A career spent making the systems behind growing teams, guest experiences, and essential operations more dependable.</p>
        <a href="mailto:zak@winnick.io">zak@winnick.io <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section class="resume-section" aria-labelledby="education-title">
      <div class="shell">
        <h2 id="education-title">Education</h2>
        <div class="education">
          <h3><a href="https://canyons.edu" target="_blank" rel="noopener noreferrer">College of the Canyons</a></h3>
          <p>Broadcast Journalism</p>
        </div>
      </div>
    </section>

    <section class="resume-section" aria-labelledby="skills-title">
      <div class="shell">
        <h2 id="skills-title">Skills</h2>
        <div class="skills">
          <span>Community &amp; Nonprofit Leadership</span>
          <span>Device Lifecycle Management</span>
          <span>EV Charging Infrastructure</span>
          <span>Event &amp; Program Development</span>
          <span>Identity &amp; Access Management</span>
          <span>IT Operations</span>
          <span>Network &amp; Property Technology</span>
          <span>Operational Leadership</span>
          <span>SaaS Administration</span>
          <span>Security &amp; Compliance</span>
          <span>Site Development &amp; Utility Coordination</span>
          <span>Systems Integration</span>
          <span>Vendor &amp; Partner Management</span>
          <span>Workflow Automation</span>
        </div>
      </div>
    </section>

    <section class="resume-section" aria-labelledby="certifications-title">
      <div class="shell">
        <h2 id="certifications-title">Certifications</h2>
        <ul class="support-list">
          <li>Creating EV Charging Hubs: Innovative Design</li>
          <li>FastTrack EV Charging Certification</li>
          <li>Master Electric Vehicle Tech: Software Skills</li>
          <li>Plug Into The Future — EV Charging Essentials</li>
          <li>Fora Certified Travel Advisor</li>
        </ul>
      </div>
    </section>

    <section class="resume-section" aria-labelledby="publications-title">
      <div class="shell">
        <h2 id="publications-title">Publications</h2>
        <ul class="support-list">
          <li><a href="https://www.voxer.com/assets/images/Westin-Case-Study.pdf" target="_blank" rel="noopener noreferrer">The Westin Nashville Depends on Voxer for Reliable Communication</a></li>
          <li><a href="https://podcast.rivianclubs.org" target="_blank" rel="noopener noreferrer">Rivian Clubs of America Podcast</a></li>
          <li><a href="https://podcast.rangeway.co" target="_blank" rel="noopener noreferrer">Trail Marker Podcast from Rangeway</a></li>
        </ul>
      </div>
    </section>
  </main>

  <footer class="site-footer shell">© <span data-copyright-year>2026</span> Zak Winnick</footer>
</body>
```

Transform the existing complete Experience section in place before the supporting sections. Preserve every current company, date, location, role, narrative paragraph, accomplishment, employer URL, and list item. Apply these exact class mappings to all eight entries:

```text
resume-list       -> experience-list
resume-entry      -> experience
resume-entry-meta -> meta
resume-entry-body -> role
resume-role       -> role-title
resume-period     -> resume-period
```

Change the existing Experience section’s opening container to:

```html
<section class="resume-section" aria-labelledby="experience-title">
  <div class="shell">
    <h2 id="experience-title">Experience</h2>
    <div class="experience-list">
```

Leave the eight transformed articles between that opening container and this exact closing container:

```html
    </div>
  </div>
</section>
```

The Castlerock entry must use:

```html
<p>Led IT across a hospitality portfolio that included <a href="https://westinnashville.com" target="_blank" rel="noopener noreferrer">The Westin Nashville</a> and <a href="https://www.opalcollection.com/nashville/" target="_blank" rel="noopener noreferrer">The Bobby Hotel (now The Nash)</a>, covering guest-facing systems, infrastructure, and corporate operations.</p>
```

- [ ] **Step 4: Replace rejected résumé-card styles with the editorial grid**

```css
.resume-intro,
.resume-section > .shell {
  display: grid;
  grid-template-columns: minmax(170px, 0.3fr) minmax(0, 1fr);
  gap: clamp(50px, 8vw, 110px);
}

.resume-intro {
  padding-block: 110px 125px;
}

.resume-intro h1 {
  margin: 0;
  font-size: clamp(50px, 6vw, 72px);
  font-weight: 500;
  letter-spacing: -0.06em;
}

.experience {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 42px;
  padding-bottom: 64px;
}

.experience + .experience {
  padding-top: 64px;
  border-top: 1px solid var(--rule);
}

.role h3 a,
.education h3 a,
.support-list a {
  color: var(--accent);
  text-decoration-style: dashed;
  text-decoration-thickness: 1px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skills span {
  padding: 8px 12px;
  border: 1px solid var(--rule);
  color: var(--muted);
}
```

- [ ] **Step 5: Run the complete contract suite**

Run:

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all site and feed tests pass; no whitespace errors.

- [ ] **Step 6: Commit the editorial résumé**

```bash
git add resume.html styles.css tests/site-contract.test.mjs
git commit -m "Rebuild complete editorial resume"
```

---

### Task 4: Complete responsive, theme, accessibility, and motion behavior

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `styles.css`
- Modify only if semantics require correction: `index.html`, `resume.html`

**Interfaces:**
- Consumes: approved homepage and résumé DOM from Tasks 1–3.
- Produces: release-ready layouts at desktop and mobile widths in both system themes.

- [ ] **Step 1: Add focused responsive and accessibility contracts**

Append:

```js
test('both pages retain accessibility fundamentals', async () => {
  for (const html of await Promise.all([read('index.html'), read('resume.html')])) {
    assert.match(html, /class="skip-link"/);
    assert.equal((html.match(/<h1/g) ?? []).length, 1);
    assert.match(html, /<main[^>]+id="main"/);
    assert.match(html, /aria-label="Primary navigation"/);
    assert.match(html, /data-copyright-year/);
  }
});

test('stylesheet contains approved themes and responsive collapse', async () => {
  const css = await read('styles.css');
  for (const value of ['#f7f5ef', '#1f211d', '#62645c', '#ef5b36', '#23231f', '#292925', '#f1ede4', '#bcb8ae', '#ff7048']) {
    assert.ok(css.includes(value), value);
  }
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
});
```

- [ ] **Step 2: Run the contracts and verify any missing markers fail**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: FAIL only for responsive/theme/accessibility markers not already supplied by Tasks 1–3.

- [ ] **Step 3: Implement the mobile collapse and touch targets**

```css
@media (max-width: 820px) {
  .shell {
    width: min(100% - 44px, 1180px);
  }

  .site-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding-block: 20px;
  }

  .site-nav {
    flex-wrap: wrap;
    gap: 10px 20px;
  }

  .site-nav a,
  .text-link,
  .role a,
  .writing-header a {
    min-height: 44px;
  }

  .hero {
    min-height: 0;
    grid-template-columns: 1fr;
    gap: 56px;
    padding-block: 64px 72px;
  }

  .portrait {
    justify-self: start;
    width: min(88%, 410px);
  }

  .career-layout,
  .roles,
  .elsewhere,
  .post-layout,
  .resume-intro,
  .resume-section > .shell,
  .experience {
    grid-template-columns: 1fr;
  }

  .now-header,
  .writing-header,
  .connect-row {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

- [ ] **Step 4: Preserve focus, reduced motion, and readable fallback behavior**

```css
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Keep the static `2026` year inside each dynamic-year span as a no-JavaScript fallback. JavaScript replaces it at runtime.

- [ ] **Step 5: Run the full automated suite**

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and no whitespace errors appear.

- [ ] **Step 6: Commit responsive and accessibility polish**

```bash
git add index.html resume.html styles.css tests/site-contract.test.mjs
git commit -m "Polish authored site responsiveness and accessibility"
```

---

### Task 5: Verify the complete local implementation

**Files:**
- Modify only if verification exposes a defect: `index.html`, `resume.html`, `styles.css`, `site.js`, `feed.js`, `tests/`

**Interfaces:**
- Consumes: complete site from Tasks 1–4.
- Produces: evidence-backed local build ready for Zak’s review, without deployment.

- [ ] **Step 1: Run all automated checks from a clean working tree**

```bash
node --test tests/*.test.mjs
git diff --check
git status --short
```

Expected: all tests pass, `git diff --check` prints nothing, and `git status --short` is empty.

- [ ] **Step 2: Start the local server**

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Expected: the server starts without errors.

- [ ] **Step 3: Verify every local asset returns HTTP 200**

```bash
for asset_path in / /resume.html /styles.css /site.js /feed.js /images/profile-bw.jpg /favicon.svg; do
  status_code=$(curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:4173${asset_path}")
  printf '%s %s\n' "$status_code" "$asset_path"
done
```

Expected: every line begins with `200`.

- [ ] **Step 4: Verify desktop and mobile visual behavior**

At desktop width, confirm:

- The name-first hero is fully visible and never overlaps the portrait.
- The portrait remains secondary and its orange outline does not cause overflow.
- No numbered sections, career banner, generic marketing headings, or repeated card grids remain.
- Rangeway and NorCal EVs have equal visual weight.
- Elsewhere reads as prose in the approved order.
- The feature post and both smaller posts display their complete images without crop, dark padding, or letterboxing.
- ZakWinnick.com is orange with a dashed underline and opens in a new tab.
- All four Font Awesome social icons are visible.
- Both footers contain only dynamic copyright.

At 390px width, confirm:

- Header links wrap without horizontal scrolling.
- Hero text precedes the portrait.
- Roles, feed, Elsewhere, résumé entries, skills, certifications, and publications remain readable.
- Every post image remains fully visible.

- [ ] **Step 5: Verify light and dark system themes**

Confirm the page responds to system theme changes without reload-dependent content loss. Dark mode must use warm charcoal rather than near-black; light mode must use warm off-white.

- [ ] **Step 6: Verify feed failure behavior**

Use the existing unit-test rejected response and confirm `Visit ZakWinnick.com` remains the browser fallback without layout collapse. Do not change the production `FEED_URL`.

- [ ] **Step 7: Verify exact external-link inventory**

Confirm:

- 8 employer links
- 2 Castlerock property links
- 1 education link
- 3 publication links
- 4 Elsewhere links
- 4 social/contact links
- 2 current-role links
- ZakWinnick.com heading and archive links

All external browser links must open in new tabs with `noopener noreferrer`.

- [ ] **Step 8: Commit verification fixes only if needed**

If verification changes files:

```bash
git add index.html resume.html styles.css site.js feed.js tests
git commit -m "Fix authored redesign verification findings"
```

If no files changed, do not create an empty commit.

- [ ] **Step 9: Report completion without deploying**

Report:

- Local preview URL
- Homepage and résumé file links
- Automated test count and result
- Feed and asset verification result
- Visual verification coverage and any tooling limitation
- Confirmation that deployment is still pending Zak’s explicit approval
