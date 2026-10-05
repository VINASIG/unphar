import assert from 'node:assert/strict';

export function inlineSiteChrome(html: string, css: string): string {
  // This small shared stylesheet has no URL-dependent resources. Inline its
  // reviewed bytes to avoid an extra render-blocking request on slow networks.
  assert(!/<\/style\b|@import\b|url\s*\(/i.test(css));
  const link =
    /<link\s+rel="stylesheet"\s+href="(?:\.\.\/)?site-chrome\.css"\s*\/>/g;
  const matches = html.match(link);
  assert(matches?.length === 1, 'Expected one shared-chrome stylesheet');
  return html.replace(link, () => `<style data-site-chrome>\n${css}</style>`);
}
