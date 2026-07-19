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

test('homepage internal anchors and approved external destinations are intact', async () => {
  const home = await read('index.html');
  for (const id of [...home.matchAll(/href="#([^"]+)"/g)].map((match) => match[1])) {
    assert.ok(home.includes(`id="${id}"`), `missing #${id}`);
  }
  for (const href of [
    'https://zakwinnick.com',
    'https://currentheading.com',
    'https://norcalevs.org',
    'https://bayarearivianclub.com',
  ]) assert.ok(home.includes(`href="${href}"`), href);
  assert.doesNotMatch(home, /href="[^"]*hawaii/i);
});

test('feed rendering uses safe DOM APIs and retains its failure fallback', async () => {
  const js = await read('site.js');
  assert.match(js, /document\.createElement/);
  assert.match(js, /\.textContent\s*=/);
  assert.match(js, /Visit ZakWinnick\.com/);
  assert.doesNotMatch(js, /\.innerHTML\s*=/);
});
