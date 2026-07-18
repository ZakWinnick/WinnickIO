# WinnickIO Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an approved profile-led personal and professional website with a complete linked resume, live ZakWinnick.com feed, and automatic light/dark themes.

**Architecture:** Keep the repository framework-free and static. Use two semantic HTML documents (`index.html` and `resume.html`), one shared stylesheet, one shared interaction module, and one pure feed module whose network and normalization behavior can be unit tested with Node's built-in test runner.

**Tech Stack:** HTML5, CSS custom properties, ES modules, Node.js `node:test`, Font Awesome 6, Google Fonts, GitHub Pages-compatible static hosting.

## Global Constraints

- Preserve `hawaii.html`, but do not link to it or include Hawaii content in the rebuilt site.
- Homepage order: Hero, Profile, Career, Now, Elsewhere, Latest Posts, Connect.
- Hero copy: `Technology. Hospitality. People.`
- Current work gives Rangeway and NorCal EVs equal visual weight.
- Elsewhere order: ZakWinnick.com, Current Heading, NorCal EVs, Bay Area Rivian Club.
- Never abbreviate Bay Area Rivian Club as `BARC` in visible copy.
- Feed URL: `https://zakwinnick.com/feed.json`; render the latest three items regardless of category.
- Connect includes Email, LinkedIn, X, and Instagram with Font Awesome icons and equal visual weight.
- Light tokens: `#f7f5ef`, `#11130f`, `#ef5b36`, `#263a30`.
- Dark tokens: `#151713`, `#f2eee5`, `#ff7048`, `#29382f`.
- Fonts: Archivo Black, DM Sans, Instrument Serif.
- Theme follows `prefers-color-scheme`; no manual theme toggle.
- Use `/Users/zakwinnick/Downloads/Profile.pdf` as the resume source of truth.
- Do not deploy until Zak approves the completed local implementation.

---

## File Structure

- `index.html` - semantic homepage content and section anchors
- `resume.html` - complete resume content and approved employer links
- `styles.css` - shared visual system, responsive layout, themes, motion, and focus states
- `site.js` - navigation behavior and safe DOM rendering for the feed
- `feed.js` - feed URL, HTML-to-text normalization, image discovery, and network loading
- `favicon.svg` - Signal Orange `ZW` identity mark
- `tests/site-contract.test.mjs` - static document and stylesheet requirements
- `tests/feed.test.mjs` - feed normalization and failure behavior
- `.gitignore` - ignores `.superpowers/` brainstorming artifacts

## Interfaces

`feed.js` exports:

```js
export const FEED_URL = 'https://zakwinnick.com/feed.json';
export function htmlToText(html) {}
export function findFirstImage(html) {}
export function normalizeFeedItem(item) {}
export async function fetchLatestPosts(fetchImpl = fetch, limit = 3) {}
```

`site.js` consumes `fetchLatestPosts()` and renders into:

```html
<div id="feed-grid" class="feed-grid" aria-live="polite"></div>
```

---

### Task 1: Establish the static contract and shared file boundaries

**Files:**
- Create: `tests/site-contract.test.mjs`
- Create: `styles.css`
- Create: `site.js`
- Create: `feed.js`
- Create: `resume.html`
- Modify: `index.html`
- Modify: `.gitignore`

**Interfaces:**
- Produces the file boundaries used by every later task.
- Produces the required homepage section IDs: `profile`, `career`, `now`, `elsewhere`, `posts`, `connect`.

- [ ] **Step 1: Write the initial failing site contract test**

```js
// tests/site-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the site uses two pages and shared assets', async () => {
  const [home, resume, css, js] = await Promise.all([
    read('index.html'),
    read('resume.html'),
    read('styles.css'),
    read('site.js'),
  ]);

  for (const html of [home, resume]) {
    assert.match(html, /href="styles\.css"/);
    assert.match(html, /src="site\.js"/);
  }
  assert.ok(css.length > 0);
  assert.ok(js.length > 0);
});

test('homepage sections follow the approved order', async () => {
  const home = await read('index.html');
  const ids = ['profile', 'career', 'now', 'elsewhere', 'posts', 'connect'];
  const positions = ids.map((id) => home.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});
```

- [ ] **Step 2: Run the contract and confirm it fails**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: FAIL because `resume.html`, `styles.css`, and `site.js` do not exist.

- [ ] **Step 3: Create the minimal semantic page shells and shared files**

Use this document structure on both pages:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">
    <script type="module" src="site.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header"></header>
    <main id="main"></main>
    <footer class="site-footer"></footer>
  </body>
</html>
```

Add empty homepage sections in the approved order and a resume main container. Add `.superpowers/` to `.gitignore`. Create syntactically valid empty modules for `site.js` and `feed.js`, and the approved theme variables in `styles.css`.

- [ ] **Step 4: Run the contract and confirm it passes**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: 2 passing tests.

- [ ] **Step 5: Commit the foundation**

```bash
git add .gitignore index.html resume.html styles.css site.js feed.js tests/site-contract.test.mjs favicon.svg
git commit -m "Build WinnickIO static site foundation"
```

---

### Task 2: Implement the approved homepage content and visual system

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `favicon.svg`

**Interfaces:**
- Consumes the section IDs and shared assets from Task 1.
- Produces the final homepage DOM consumed by `site.js` in Task 4.

- [ ] **Step 1: Extend the failing homepage contract**

Append:

```js
test('homepage contains the approved identity and no rejected content', async () => {
  const home = await read('index.html');
  assert.match(home, /Technology\.<br>\s*Hospitality\.<br>\s*<span[^>]*>People\.<\/span>/);
  assert.doesNotMatch(home, /Hawai|Big Island|Building places worth stopping/i);
  assert.doesNotMatch(home, />BARC</);
});

test('current work gives both roles equal structural weight', async () => {
  const home = await read('index.html');
  assert.equal((home.match(/class="now-card/g) ?? []).length, 2);
  assert.match(home, /Rangeway/);
  assert.match(home, /NorCal EVs/);
});

test('elsewhere links use exact naming and order', async () => {
  const home = await read('index.html');
  const names = ['ZakWinnick.com', 'Current Heading', 'NorCal EVs', 'Bay Area Rivian Club'];
  const positions = names.map((name) => home.indexOf(name));
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
});

test('connect contains every approved link and Font Awesome icon', async () => {
  const home = await read('index.html');
  for (const value of [
    'mailto:zak@winnick.io',
    'https://www.linkedin.com/in/zakwinnick',
    'https://x.com/ZakWinnick',
    'https://instagram.com/zakwinnick',
    'fa-envelope',
    'fa-linkedin-in',
    'fa-x-twitter',
    'fa-instagram',
  ]) assert.ok(home.includes(value), value);
});
```

- [ ] **Step 2: Run the contract and confirm the new assertions fail**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: the four new tests fail against the empty shells.

- [ ] **Step 3: Write the approved homepage copy**

Use this content hierarchy and copy:

```html
<section class="hero" aria-labelledby="hero-title">
  <p class="eyebrow">Operator · Community builder · Technologist</p>
  <h1 id="hero-title">Technology.<br>Hospitality.<br><span>People.</span></h1>
  <p class="hero-intro">I’ve spent my career making complex systems work better for the people who depend on them.</p>
  <img src="images/profile-bw.jpg" alt="Zak Winnick outdoors in the desert">
</section>

<section id="profile">
  <h2>Who I am</h2>
  <p>I’m a systems-minded operator and community builder who has spent more than two decades working at the intersection of technology, hospitality, and the people who rely on both.</p>
  <p>I’m drawn to complicated environments, practical solutions, and work that makes someone’s day run a little better.</p>
</section>

<section id="career">
  <p class="section-kicker">The arc, not the résumé</p>
  <h2>A career built behind the scenes.</h2>
  <p>My career has moved through hospitality, logistics, SaaS, fintech, and healthtech—usually in roles responsible for the systems nobody notices until they stop working. Along the way, I’ve led IT operations, identity and access management, security and compliance programs, property technology, and the operational foundations behind growing teams.</p>
  <p>That experience now informs how I approach infrastructure and community leadership: understand the real operating environment, make the complicated parts dependable, and never lose sight of the person on the other side.</p>
  <a href="resume.html">View my complete résumé</a>
</section>
```

Create equal `now-card` articles for Rangeway and NorCal EVs. Create four Elsewhere links in the exact approved order. Add the `feed-grid` target. Create four equal Connect links with visible labels and Font Awesome icons.

Use this exact supporting copy:

```text
Rangeway
Founder & Chief Executive Officer
I’m building a hospitality-driven premium EV charging network around reliability, comfort, and the real needs of long-distance drivers.

NorCal EVs
Executive Director
I help lead Northern California’s cross-brand EV owner community, creating events, education, and connections that make EV ownership more useful and welcoming.

ZakWinnick.com
Short posts, photos, and longer stories from whatever has my attention.

Current Heading
My personal brand and home for independent projects.

NorCal EVs
Northern California’s cross-brand EV community.

Bay Area Rivian Club
Events, education, and community for Rivian owners around the Bay Area.
```

- [ ] **Step 4: Implement the approved visual system**

Set the exact theme tokens:

```css
:root {
  color-scheme: light dark;
  --bg: #f7f5ef;
  --fg: #11130f;
  --accent: #ef5b36;
  --portrait-field: #263a30;
  --muted: #595c54;
  --rule: rgba(17, 19, 15, 0.32);
  --display: "Archivo Black", "Arial Black", sans-serif;
  --body: "DM Sans", "Trebuchet MS", sans-serif;
  --narrative: "Instrument Serif", Georgia, serif;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #151713;
    --fg: #f2eee5;
    --accent: #ff7048;
    --portrait-field: #29382f;
    --muted: #cbc6bc;
    --rule: rgba(242, 238, 229, 0.32);
  }
}
```

Implement the approved orange identity rail, compact upper-right menu, split hero, bold display typography, quiet serif narrative blocks, equal Now cards, four-column Elsewhere grid, three-column feed grid, and four equal Connect links. Use square corners, thin rules, deliberate asymmetry, and no card shadows.

- [ ] **Step 5: Run the contract and confirm it passes**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: all site contract tests pass.

- [ ] **Step 6: Commit the homepage**

```bash
git add index.html styles.css favicon.svg tests/site-contract.test.mjs
git commit -m "Build profile-led WinnickIO homepage"
```

---

### Task 3: Build the complete linked resume page

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `resume.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes the shared header, navigation, themes, and typography.
- Produces the complete source-of-truth resume page.

- [ ] **Step 1: Add the failing resume contract**

Append:

```js
test('resume contains all approved sections and employer links', async () => {
  const resume = await read('resume.html');
  for (const heading of ['Experience', 'Education', 'Skills', 'Certifications', 'Publications']) {
    assert.match(resume, new RegExp(`<h2[^>]*>${heading}<\\/h2>`));
  }
  for (const href of [
    'https://rangeway.co/',
    'https://norcalevs.org/',
    'https://curaihealth.com/',
    'https://octane.co/',
    'https://commentsold.com/',
    'https://sensei.com/',
    'https://www.castlerockam.com/',
    'https://geodis.com/',
  ]) assert.ok(resume.includes(href), href);
});

test('resume contains every LinkedIn-exported role', async () => {
  const resume = await read('resume.html');
  for (const role of [
    'Chief Executive Officer',
    'Executive Director',
    'Information Technology Manager',
    'Senior Identity Services Engineer',
    'Information Technology Administrator',
    'Corporate Information Technology Manager',
    'Tier II IT Support Analyst',
  ]) assert.ok(resume.includes(role), role);
});
```

- [ ] **Step 2: Run the resume contract and confirm it fails**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: resume tests fail against the empty resume shell.

- [ ] **Step 3: Implement all eight experience entries**

Use this repeatable structure for every entry:

```html
<article class="resume-entry">
  <div class="resume-entry-meta">
    <p class="resume-period">June 2025–Present</p>
    <p>San Francisco Bay Area</p>
  </div>
  <div class="resume-entry-body">
    <h3><a href="https://rangeway.co/" target="_blank" rel="noopener noreferrer">Rangeway</a></h3>
    <p class="resume-role">Chief Executive Officer</p>
    <p>Building America’s first hospitality-driven premium EV charging network.</p>
    <ul>
      <li>Developed a robust site development pipeline, including sites in California, Missouri, and Montana.</li>
      <li>Built utility interconnection and permitting strategy for DC fast-charging sites.</li>
      <li>Designed operations for remote, hospitality-driven charging locations.</li>
      <li>Developed hardware, energy, and real estate partnerships.</li>
    </ul>
  </div>
</article>
```

Populate the eight entries with the following source-of-truth content:

```text
Rangeway
Chief Executive Officer
June 2025–Present
San Francisco Bay Area
Building America’s first hospitality-driven premium EV charging network. Rangeway pairs ultra-fast DC charging with climate-controlled driver lounges, quality food and beverage, and hospitality-grade amenities across Waystations, Basecamps, and Summits along underserved U.S. travel corridors.
- Developed a robust site development pipeline, including sites in California, Missouri, and Montana.
- Built utility interconnection and permitting strategy for DC fast-charging sites.
- Designed operations for remote, hospitality-driven charging locations.
- Developed hardware, energy, and real estate partnerships.

NorCal EVs
Executive Director
January 2025–Present
San Francisco Bay Area
Founding Board Member and Executive Director of NorCal EVs, a 501(c)(7) nonprofit building Northern California’s largest cross-brand EV owner community.
- Established nonprofit structure, membership programs, and digital presence from the ground up.
- Lead community strategy, event programming, and marque partnerships across Rivian, Tesla, Ford, Polestar, and others.

Curai Health
Information Technology Manager
January 2024–January 2025
San Francisco, California
Led IT operations for a Series B healthtech company, driving security, compliance, and scalability improvements across a distributed workforce of 150+.
- Migrated the HR, IAM, and MDM stack from Rippling to BambooHR, Okta, and Kandji, strengthening security and cutting device provisioning time from one hour to 15 minutes.
- Built automated onboarding and offboarding workflows integrating HR, identity, and device systems, eliminating eight hours per week of manual work.
- Established an internal IT documentation library supporting cross-functional knowledge sharing.

Octane
Senior Identity Services Engineer
May 2022–January 2024
New York, New York
Owned identity and access management for 800+ users at a fintech lender, directly supporting SOC 2 compliance and SaaS access governance.
- Administered Okta across 20+ SaaS integrations, reducing access-request turnaround from two to three days to approximately two hours.
- Built audit workflows supporting SOC 2 certification and annual audits.
- Partnered with engineering and security on IAM architecture for a rapidly scaling organization.

CommentSold
Information Technology Administrator
January 2021–June 2022
Huntsville, Alabama
Owned end-to-end IT operations at a high-growth social-commerce SaaS company during rapid team expansion.
- Supported IT operations as headcount scaled from 100 to 300+ across distributed and on-site teams.
- Designed onboarding workflows that reduced new-hire IT provisioning time from one day to two hours.
- Built asset-management protocols tracking 200+ devices across remote and headquarters locations, improving inventory accuracy and renewal cycles.
- Served as primary internal IT support across SaaS, identity, hardware, and network issues, maintaining 98% resolution metrics.

Sensei
Corporate Information Technology Manager
January 2022–May 2022
Santa Monica, California
Led corporate IT for a premium wellness hospitality brand operating destination retreats and urban locations in a short-term engagement focused on operational maturity during a growth phase.
- Owned Mac and Windows environments supporting 50 corporate employees and 200 property-based staff.
- Led vendor integrations unifying HR, identity, and compliance systems into a single operational stack.
- Executed network upgrades supporting new property openings and corporate expansion.
- Partnered with security and compliance on frameworks supporting guest-data handling and corporate governance.

Castlerock Asset Management, LLC.
Information Technology Manager
September 2017–July 2020
Nashville, Tennessee
Led IT across a portfolio of hospitality properties in the Nashville and Tampa markets, covering guest-facing systems, back-of-house infrastructure, and corporate operations.
- Owned IT strategy and operations across three properties totaling 1,000+ guest rooms and 500 team members.
- Deployed and maintained PMS, POS, networking, and security systems, achieving 99% uptime across the portfolio.
- Negotiated vendor contracts and consolidated overlapping tools, saving approximately $50,000 annually.
- Established network segmentation, firewall policies, and backup protocols supporting PCI posture and business continuity.
- Led the IT work stream for new property openings, renovations, and acquisitions across the portfolio.

GEODIS
Tier II IT Support Analyst
September 2015–August 2017
Brentwood, Tennessee
Provided Tier II technical support for one of the world’s largest third-party logistics providers, covering corporate facilities and distribution centers critical to global supply-chain operations.
- Resolved escalated tickets across hardware, networking, and enterprise software while exceeding targeted CSAT and SLA metrics on 200+ tickets annually.
- Configured and deployed RF scanners and mobile-computing equipment essential to warehouse throughput across 150+ distribution centers.
- Administered Active Directory and managed system configurations enterprise-wide.
- Led the IT work stream for site rollouts and technology implementation projects.
- Authored SOPs and technical documentation that strengthened Tier I-to-Tier II handoffs and reduced escalation volume.
- Covered a 24/7 on-call rotation supporting round-the-clock supply-chain operations.
```

- [ ] **Step 4: Add the complete supporting sections**

Add:

- Education: College of the Canyons, Broadcast Journalism
- Skills: Computer Management, Server Administration, IT Operations Management
- Certifications: Fora Certified Travel Advisor; Creating EV Charging Hubs: Innovative Design; Master Electric Vehicle Tech: Software Skills; Plug Into The Future - EV Charging Essentials; FastTrack EV Charging Certification
- Publications: The Westin Nashville Depends on Voxer for Reliable Communication; Rivian Clubs of America Podcast; Trail Marker Podcast from Rangeway

- [ ] **Step 5: Style the resume for reading rather than card browsing**

Use a wide editorial grid with date/location metadata in the narrow column and role content in the wide column. Preserve full-width flow on mobile. Keep company links obvious, focusable, and visually restrained.

- [ ] **Step 6: Run the contract and confirm it passes**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: all site and resume tests pass.

- [ ] **Step 7: Commit the resume**

```bash
git add resume.html styles.css tests/site-contract.test.mjs
git commit -m "Add complete linked resume page"
```

---

### Task 4: Implement and test the live JSON Feed

**Files:**
- Create: `tests/feed.test.mjs`
- Modify: `feed.js`
- Modify: `site.js`
- Modify: `styles.css`

**Interfaces:**
- Produces `fetchLatestPosts(fetchImpl, limit)` returning normalized post objects.
- Consumed by `site.js` to render safe DOM nodes inside `#feed-grid`.

- [ ] **Step 1: Write failing feed unit tests**

```js
// tests/feed.test.mjs
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
  const fetchImpl = async (url) => ({
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
```

- [ ] **Step 2: Run the feed tests and confirm they fail**

Run:

```bash
node --test tests/feed.test.mjs
```

Expected: FAIL because the named exports do not exist.

- [ ] **Step 3: Implement pure feed normalization and loading**

```js
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
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function findFirstImage(html = '') {
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

export function normalizeFeedItem(item = {}) {
  const text = htmlToText(item.content_html);
  const title = (item.title || text || 'From ZakWinnick.com').trim();
  return {
    title,
    excerpt: text.slice(0, 180),
    image: item.image || findFirstImage(item.content_html),
    url: item.url,
    date: item.date_published,
  };
}

export async function fetchLatestPosts(fetchImpl = fetch, limit = 3) {
  const response = await fetchImpl(FEED_URL);
  if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
  const feed = await response.json();
  return (Array.isArray(feed.items) ? feed.items : [])
    .slice(0, limit)
    .map(normalizeFeedItem);
}
```

- [ ] **Step 4: Run the feed tests and confirm they pass**

Run:

```bash
node --test tests/feed.test.mjs
```

Expected: 4 passing tests.

- [ ] **Step 5: Render feed items safely in the browser**

In `site.js`, create every element with `document.createElement`, assign user-visible strings through `textContent`, validate URLs through `new URL`, and never assign feed content to `innerHTML`. Render dates with `Intl.DateTimeFormat`. On error or an empty array, replace the reserved grid with one link to `https://zakwinnick.com/`.

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

  if (post.date) {
    const time = document.createElement('time');
    time.dateTime = post.date;
    time.textContent = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(post.date));
    article.append(time);
  }

  const link = document.createElement('a');
  link.href = postUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  const title = document.createElement('h3');
  title.textContent = post.title;
  link.append(title);
  article.append(link);

  if (post.excerpt) {
    const excerpt = document.createElement('p');
    excerpt.textContent = post.excerpt;
    article.append(excerpt);
  }

  return article;
}

async function loadFeed() {
  if (!feedGrid) return;
  try {
    const posts = await fetchLatestPosts();
    if (!posts.length) throw new Error('Feed is empty');
    feedGrid.replaceChildren(...posts.map(createPostCard));
  } catch {
    const fallback = document.createElement('a');
    fallback.href = 'https://zakwinnick.com/';
    fallback.textContent = 'Visit ZakWinnick.com';
    feedGrid.replaceChildren(fallback);
  }
}

loadFeed();
```

- [ ] **Step 6: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: all contract and feed tests pass.

- [ ] **Step 7: Commit the feed**

```bash
git add feed.js site.js styles.css tests/feed.test.mjs
git commit -m "Add live ZakWinnick.com feed"
```

---

### Task 5: Complete responsive, accessibility, and theme behavior

**Files:**
- Modify: `tests/site-contract.test.mjs`
- Modify: `index.html`
- Modify: `resume.html`
- Modify: `styles.css`
- Modify: `site.js`

**Interfaces:**
- Consumes the complete page and feed DOM.
- Produces release-ready responsive and accessible behavior.

- [ ] **Step 1: Add failing accessibility and theme contracts**

Append:

```js
test('both pages include accessibility fundamentals', async () => {
  for (const html of await Promise.all([read('index.html'), read('resume.html')])) {
    assert.match(html, /class="skip-link"/);
    assert.equal((html.match(/<h1/g) ?? []).length, 1);
    assert.match(html, /<main[^>]+id="main"/);
    assert.match(html, /aria-label="Primary navigation"/);
  }
});

test('stylesheet supports system themes, reduced motion, and responsive layouts', async () => {
  const css = await read('styles.css');
  assert.match(css, /prefers-color-scheme:\s*dark/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
});
```

- [ ] **Step 2: Run the contracts and confirm any missing behavior fails**

Run:

```bash
node --test tests/site-contract.test.mjs
```

Expected: FAIL until all accessibility and responsive markers exist.

- [ ] **Step 3: Implement the responsive breakpoints**

At `980px`, reduce hero display size and collapse four-column Elsewhere into two columns. At `720px`, narrow the rail, stack hero copy above portrait, collapse Now, feed, Connect, and resume entry grids into one column, and keep touch targets at least 44px tall.

- [ ] **Step 4: Implement interaction accessibility**

Add skip-link reveal on focus, a 2px visible focus outline with 4px offset, proper external-link labels, decorative icon `aria-hidden="true"`, and descriptive text labels. Add an active-section navigation indicator only if it does not interfere with keyboard focus.

- [ ] **Step 5: Implement theme and motion listeners**

CSS handles theme changes automatically. Use JavaScript only for a compact mobile menu if the final header cannot fit without it. Ensure content remains accessible with JavaScript disabled. Under reduced motion, disable transforms and animation while preserving visibility.

- [ ] **Step 6: Run the complete automated suite**

Run:

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass and `git diff --check` produces no output.

- [ ] **Step 7: Commit responsive and accessibility work**

```bash
git add index.html resume.html styles.css site.js tests/site-contract.test.mjs
git commit -m "Polish responsive themes and accessibility"
```

---

### Task 6: Verify the completed local site

**Files:**
- Modify only if verification reveals a defect: `index.html`, `resume.html`, `styles.css`, `site.js`, `feed.js`, tests

**Interfaces:**
- Produces the final evidence-backed local implementation.

- [ ] **Step 1: Run all automated checks**

```bash
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests pass; no whitespace errors.

- [ ] **Step 2: Serve the site locally**

```bash
python3 -m http.server 4173
```

Expected: `index.html`, `resume.html`, `styles.css`, `site.js`, `feed.js`, portrait, and favicon return HTTP 200.

- [ ] **Step 3: Verify live behavior visually**

Check desktop and mobile layouts in both light and dark system themes. Confirm the approved split hero, portrait, section hierarchy, exact Elsewhere order, equal Now cards, latest three posts, complete Connect links, and readable resume.

- [ ] **Step 4: Verify failure behavior**

Temporarily route the feed loader to a rejected request in the isolated test environment and confirm the page displays `Visit ZakWinnick.com` without console errors or layout collapse. Restore the production feed URL and rerun unit tests.

- [ ] **Step 5: Verify every link**

Confirm internal anchors, resume navigation, eight employer links, four Elsewhere links, and four Connect links reach the approved targets.

- [ ] **Step 6: Commit any verification fixes**

If verification required changes:

```bash
git add index.html resume.html styles.css site.js feed.js tests
git commit -m "Fix WinnickIO verification findings"
```

If no changes were required, do not create an empty commit.

- [ ] **Step 7: Report completion without deploying**

Report local file links, test results, visual verification evidence, and the fact that deployment remains pending Zak's explicit approval.
