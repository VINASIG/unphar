import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inlineSiteChrome } from '../scripts/site-styles.ts';

await test('the build inlines exact shared CSS bytes in both relative locale paths', () => {
  const css = '/* reviewed source */\n[data-site-header] { gap: 16px; }\n';
  for (const prefix of ['', '../']) {
    const link = `<link rel="stylesheet" href="${prefix}site-chrome.css" />`;
    const html = `<head><link rel="stylesheet" href="${prefix}style.css" />${link}</head>`;
    assert.equal(
      inlineSiteChrome(html, css),
      `<head><link rel="stylesheet" href="${prefix}style.css" /><style data-site-chrome>\n${css}</style></head>`,
    );
  }
});

await test('missing or duplicated stylesheet links fail instead of producing drift', () => {
  const link = '<link rel="stylesheet" href="site-chrome.css" />';
  assert.throws(() => inlineSiteChrome('<head></head>', ''), /Expected one/);
  assert.throws(() => inlineSiteChrome(link + link, ''), /Expected one/);
});

await test('inline CSS rejects style terminators and resources needing a base URL', () => {
  const html = '<link rel="stylesheet" href="site-chrome.css" />';
  for (const css of [
    '</style>',
    '@import "other.css";',
    'a { background: url(a.svg); }',
  ]) {
    assert.throws(() => inlineSiteChrome(html, css));
  }
});
