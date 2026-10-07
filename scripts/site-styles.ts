import assert from 'node:assert/strict';
import { transform } from 'esbuild';

export const publicationScripts = [
  'copy.js',
  'archive.js',
  'script.js',
] as const;

export async function minifyPublicationSource(
  source: string,
  loader: 'css' | 'js',
): Promise<string> {
  const result = await transform(source, {
    loader,
    minify: true,
    charset: 'utf8',
    legalComments: 'inline',
    target: ['chrome120', 'firefox120', 'safari17'],
  });
  assert.equal(result.warnings.length, 0, 'Unexpected compiler warning');
  return '/*! SPDX-License-Identifier: AGPL-3.0-or-later */\n' + result.code;
}

export const normalizeBootstrap = (source: string) =>
  source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n')
    .trim();

export const publicationStyles = [
  'tokens.css',
  'style.css',
  'control-surfaces.css',
  'preferences.css',
  'site-chrome.css',
] as const;

export async function preparePublicationHtml(
  html: string,
  styles: Readonly<Record<(typeof publicationStyles)[number], string>>,
  prefix: '' | '../',
  bootstrap: string,
): Promise<string> {
  const scripts = [
    ...html.matchAll(/<script data-theme-init>([\s\S]*?)<\/script>/g),
  ];
  assert.equal(scripts.length, 1, 'Expected one inline preferences runtime');
  const script = scripts[0];
  assert(script?.[1], 'Missing inline preferences runtime');
  assert.equal(
    normalizeBootstrap(script[1]),
    normalizeBootstrap(bootstrap),
    'Inline preferences source drift',
  );
  for (const filename of publicationStyles) {
    let css = styles[filename];
    assert(!/<\/style\b|@import\b/i.test(css), 'Unsafe inline CSS');
    for (const match of css.matchAll(
      /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi,
    )) {
      const url = match[1] ?? match[2] ?? match[3];
      assert(
        url?.startsWith('data:') ||
          (filename === 'tokens.css' &&
            url === 'assets/fonts/SpaceGrotesk-VariableFont_wght.woff2'),
        'Unreviewed inline CSS resource',
      );
    }
    if (filename === 'tokens.css' && prefix)
      css = css.replaceAll(
        "url('assets/fonts/SpaceGrotesk-VariableFont_wght.woff2')",
        "url('../assets/fonts/SpaceGrotesk-VariableFont_wght.woff2')",
      );
    css = await minifyPublicationSource(css, 'css');
    assert(!/<\/style\b/i.test(css), 'Unsafe compiled CSS');
    const link = `<link rel="stylesheet" href="${prefix}${filename}" />`;
    assert(
      html.split(link).length === 2,
      `Expected one ${filename} stylesheet`,
    );
    html = html.replace(
      link,
      () => `<style data-publication-style="${filename}">\n${css}</style>`,
    );
  }
  const redundant = `<script src="${prefix}preferences.js" defer></script>`;
  assert(
    html.split(redundant).length === 2,
    'Expected one deferred preferences script',
  );
  const compiledBootstrap = await minifyPublicationSource(bootstrap, 'js');
  assert(!/<\/script\b/i.test(compiledBootstrap), 'Unsafe compiled script');
  html = html.replace(
    script[0],
    () => `<script data-theme-init>${compiledBootstrap}</script>`,
  );
  return html.replace(
    /[\t ]*<script src="(?:\.\.\/)?preferences\.js" defer><\/script>/,
    '',
  );
}
