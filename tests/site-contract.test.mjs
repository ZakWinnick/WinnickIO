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
  const elsewhere = home.slice(home.indexOf('id="elsewhere"'), home.indexOf('id="posts"'));
  const names = ['ZakWinnick.com', 'Current Heading', 'NorCal EVs', 'Bay Area Rivian Club'];
  const positions = names.map((name) => elsewhere.indexOf(name));
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
