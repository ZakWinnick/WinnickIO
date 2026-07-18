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
