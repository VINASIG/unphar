import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  preparePublicationHtml,
  publicationStyles,
} from '../scripts/site-styles.ts';

const styles = {
  'tokens.css':
    "@font-face { src: url('assets/fonts/SpaceGrotesk-VariableFont_wght.woff2'); }",
  'style.css': 'body { margin: 0; }',
  'control-surfaces.css': 'input { accent-color: blue; }',
  'preferences.css': 'button { cursor: pointer; }',
  'site-chrome.css': 'header { gap: 16px; }',
};
const fixture = (prefix: '' | '../') =>
  '<head>' +
  publicationStyles
    .map((name) => `<link rel="stylesheet" href="${prefix}${name}" />`)
    .join('') +
  `<script src="${prefix}preferences.js" defer></script><script data-theme-init>bootstrap</script></head>`;

await test('both locales retain CSS order, reviewed font resolution and one compiled runtime', async () => {
  const banner = '/*! SPDX-License-Identifier: AGPL-3.0-or-later */\n';
  for (const prefix of ['', '../'] as const) {
    const html = await preparePublicationHtml(
      fixture(prefix),
      styles,
      prefix,
      'bootstrap',
    );
    const expectedStyles = {
      'tokens.css': `@font-face{src:url(${prefix}assets/fonts/SpaceGrotesk-VariableFont_wght.woff2)}\n`,
      'style.css': 'body{margin:0}\n',
      'control-surfaces.css': 'input{accent-color:blue}\n',
      'preferences.css': 'button{cursor:pointer}\n',
      'site-chrome.css': 'header{gap:16px}\n',
    };
    let previous = -1;
    for (const name of publicationStyles) {
      const expected = banner + expectedStyles[name];
      const position = html.indexOf(
        `<style data-publication-style="${name}">\n${expected}</style>`,
      );
      assert(position > previous);
      previous = position;
    }
    assert(!html.includes('rel="stylesheet"'));
    assert(!html.includes('src="' + prefix + 'preferences.js"'));
    assert(
      html.includes(`<script data-theme-init>${banner}bootstrap;\n</script>`),
    );
  }
});

await test('missing, duplicated or changed bootstrap inputs fail instead of drifting', async () => {
  const link = '<link rel="stylesheet" href="style.css" />';
  const html = fixture('');
  for (const invalid of [
    html.replace(link, ''),
    html.replace(link, link + link),
    html.replace('<script data-theme-init>', '<script>'),
    html.replace('>bootstrap<', '>changed<'),
    html.replace(
      '<script data-theme-init>bootstrap</script>',
      '<script data-theme-init>bootstrap</script><script data-theme-init>bootstrap</script>',
    ),
  ])
    await assert.rejects(() =>
      preparePublicationHtml(invalid, styles, '', 'bootstrap'),
    );
});

await test('inline CSS rejects terminators, nested imports and unreviewed external resources', async () => {
  for (const css of [
    '</style>',
    '@import "other.css";',
    'a { background: url(a.svg); }',
    'a { background: url(https://example.com/a.svg); }',
  ])
    await assert.rejects(() =>
      preparePublicationHtml(
        fixture(''),
        { ...styles, 'style.css': css },
        '',
        'bootstrap',
      ),
    );
});
