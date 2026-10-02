import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { startServer } from '../../scripts/serve.ts';
import { api, zipFixture } from '../setup.ts';

let app: Awaited<ReturnType<typeof startServer>>;
test.beforeAll(async () => {
  app = await startServer(path.resolve('dist'));
});
test.afterAll(async () => {
  await app.close();
});
const viewports = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 440, height: 800 },
  { width: 479, height: 800 },
  { width: 480, height: 800 },
  { width: 481, height: 800 },
  { width: 600, height: 800 },
  { width: 767, height: 1024 },
  { width: 768, height: 1024 },
  { width: 900, height: 800 },
  { width: 1023, height: 768 },
  { width: 1024, height: 768 },
  { width: 1439, height: 900 },
  { width: 1440, height: 900 },
];
async function capture(
  page: Page,
  info: TestInfo,
  state: string,
): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo(0, document.documentElement.scrollHeight);
  });
  const size = page.viewportSize();
  assert(size);
  const directory = 'output/responsive';
  await mkdir(directory, { recursive: true });
  const suffix = info.title.includes('200%') ? 'text-200' : 'text-100';
  await page.screenshot({
    path: `${directory}/after-home-${String(size.width)}x${String(size.height)}-${info.project.name}-${suffix}-${state}.png`,
    fullPage: true,
  });
  const geometry = await page.evaluate(() => ({
    width: innerWidth,
    scroll: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(geometry.scroll, JSON.stringify(geometry)).toBeLessThanOrEqual(
    geometry.width + 1,
  );
  expect(geometry.body, JSON.stringify(geometry)).toBeLessThanOrEqual(
    geometry.width + 1,
  );
}
async function upload(
  page: Page,
  name = 'sample.zip',
  bytes?: Uint8Array,
): Promise<void> {
  await page.locator('#archive-input').setInputFiles({
    name,
    mimeType: 'application/octet-stream',
    buffer: Buffer.from(bytes ?? (await zipFixture())),
  });
}
async function fixtureDownload(page: Page): Promise<Uint8Array<ArrayBuffer>> {
  const pending = page.waitForEvent('download');
  await upload(page);
  const download = await pending;
  const file = await download.path();
  assert(file);
  return new Uint8Array(await readFile(file));
}

for (const viewport of viewports)
  for (const textScale of [100, 200]) {
    test(`responsive ${String(viewport.width)}x${String(viewport.height)} text ${String(textScale)}%`, async ({
      page,
    }, info) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize(viewport);
      await page.goto(app.url);
      if (textScale === 200)
        await page.addStyleTag({ content: 'html {font-size:200%}' });
      await expect(
        page.getByRole('button', { name: 'Choose a PHAR or ZIP file' }),
      ).toBeVisible();
      await capture(page, info, 'idle');
      await page
        .getByText('Supported formats and limits', { exact: true })
        .click();
      await expect(
        page.getByText('Conversion preserves file contents and paths.', {
          exact: false,
        }),
      ).toBeVisible();
      await capture(page, info, 'notes-open');
      await upload(page, 'broken.zip', new TextEncoder().encode('PK broken'));
      await expect(page.getByRole('status')).toContainText('damaged');
      await expect(
        page.getByRole('button', { name: 'Choose a PHAR or ZIP file' }),
      ).toBeEnabled();
      await capture(page, info, 'error');
      const longPath = `nested/${'long-project-name-'.repeat(12)}tiếng-việt.txt`;
      const bytes = await zipFixture('DEFLATE', [
        {
          name: longPath,
          data: new TextEncoder().encode('Siêu trí tuệ'),
          mtime: 1700000000,
        },
      ]);
      const pending = page.waitForEvent('download');
      await upload(page, `${'long-export-name-'.repeat(8)}.zip`, bytes);
      await pending;
      await expect(page.getByRole('status')).toContainText('1 file checked');
      await page.locator('#contents-summary').click();
      await expect(page.locator('#file-list')).toHaveText(longPath);
      await capture(page, info, 'long-success');
      await page.locator('#file-list').evaluate((node) => {
        node.scrollTop = node.scrollHeight;
      });
      await capture(page, info, 'long-success-list-bottom');
      expect(errors).toEqual([]);
    });
  }

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
])
  for (const theme of ['light', 'dark'] as const)
    for (const motion of ['no-preference', 'reduce'] as const) {
      test(`archive flow ${String(viewport.width)} ${theme} ${motion}`, async ({
        page,
      }, info) => {
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: theme, reducedMotion: motion });
        const external: string[] = [];
        const errors: string[] = [];
        page.on('request', (request) => {
          if (
            !request.url().startsWith(app.url.replace(/unphar\/$/, '')) &&
            !request.url().startsWith('blob:')
          )
            external.push(request.url());
        });
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(app.url);
        await page.evaluate(() => document.fonts.ready);
        const font = await page.evaluate(() => ({
          ready: document.fonts.check('16px "Space Grotesk"'),
          family: getComputedStyle(document.body).fontFamily,
        }));
        expect(font.ready).toBe(true);
        expect(font.family).toContain('Space Grotesk');
        const before = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(before.violations).toEqual([]);
        const chooser = page.getByRole('button', {
          name: 'Choose a PHAR or ZIP file',
        });
        await chooser.focus();
        const picking = page.waitForEvent('filechooser');
        await page.keyboard.press('Enter');
        const picker = await picking;
        const next = page.waitForEvent('download');
        await picker.setFiles({
          name: 'sample.zip',
          mimeType: 'application/zip',
          buffer: Buffer.from(await zipFixture()),
        });
        const downloaded = await next;
        const downloadedPath = await downloaded.path();
        assert(downloadedPath);
        const phar = new Uint8Array(await readFile(downloadedPath));
        expect((await api.parsePhar(phar)).map((entry) => entry.name)).toEqual([
          'hello.txt',
          'nested/tiếng-việt.txt',
          'empty.txt',
        ]);
        const back = page.waitForEvent('download');
        await upload(page, 'sample.phar', phar);
        const zip = await back;
        const zipPath = await zip.path();
        assert(zipPath);
        expect(
          (await api.readZip(new Uint8Array(await readFile(zipPath)))).length,
        ).toBe(3);
        await expect(page.getByRole('status')).toContainText('3 files checked');
        await page.locator('#contents-summary').click();
        await page
          .getByText('Supported formats and limits', { exact: true })
          .click();
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(axe.violations).toEqual([]);
        await capture(page, info, `${theme}-${motion}-roundtrip`);
        expect(errors).toEqual([]);
        expect(external).toEqual([]);
        const transition = await chooser.evaluate(
          (node) => getComputedStyle(node).transitionDuration,
        );
        if (motion === 'reduce') expect(transition).toBe('0s');
        const box = await chooser.boundingBox();
        assert(box);
        expect(box.height).toBeGreaterThanOrEqual(44);
      });
    }

test('public metadata and relative assets work at root and project base paths', async ({
  page,
}) => {
  for (const url of [app.url, app.url.replace(/unphar\/$/, '')]) {
    await page.goto(url);
    await expect(page).toHaveTitle('VINASIG Unphar - PHAR and ZIP converter');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://vinasig.github.io/unphar/',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /without uploading/,
    );
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    assert(json);
    const parsed: unknown = JSON.parse(json);
    assert(parsed && typeof parsed === 'object' && 'name' in parsed);
    expect(parsed.name).toBe('VINASIG Unphar');
    const links = await page
      .locator('link[rel="icon"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
    for (const href of links) {
      assert(href);
      const response = await page.request.get(new URL(href, url).href);
      expect(response.ok()).toBe(true);
    }
    const logo = page.locator('.brand img');
    expect(
      await logo.evaluate(
        (node) =>
          node instanceof HTMLImageElement &&
          node.complete &&
          node.naturalWidth > 0,
      ),
    ).toBe(true);
    expect(
      (await page.request.get(new URL('sitemap.xml', url).href)).ok(),
    ).toBe(true);
  }
});

test('desktop motion is brief, reversible and disabled for reduced motion', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(app.url);
  const button = page.getByRole('button', {
    name: 'Choose a PHAR or ZIP file',
  });
  const icon = page.locator('.upload-icon');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await button.hover();
  await page.screenshot({
    path: `output/responsive/after-home-1440x900-${info.project.name}-hover-start.png`,
  });
  await page.waitForTimeout(80);
  await page.screenshot({
    path: `output/responsive/after-home-1440x900-${info.project.name}-hover-mid.png`,
  });
  await page.waitForTimeout(100);
  expect(await icon.evaluate((node) => getComputedStyle(node).transform)).toBe(
    'matrix(1, 0, 0, 1, 0, -2)',
  );
  await page.screenshot({
    path: `output/responsive/after-home-1440x900-${info.project.name}-hover-end.png`,
  });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(180);
  expect(
    await icon.evaluate((node) => getComputedStyle(node).transform),
  ).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  await button.hover();
  await page.mouse.move(0, 0);
  await button.hover();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(180);
  expect(
    await icon.evaluate((node) => getComputedStyle(node).transform),
  ).toMatch(/none|matrix\(1, 0, 0, 1, 0, 0\)/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.hover();
  expect(
    await icon.evaluate((node) => getComputedStyle(node).transitionDuration),
  ).toBe('0s');
  expect(await icon.evaluate((node) => getComputedStyle(node).transform)).toBe(
    'none',
  );
});

test('file folder opens offline and converts ZIP without a server', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve('dist/index.html')).href);
  const bytes = await fixtureDownload(page);
  expect((await api.parsePhar(bytes)).length).toBe(3);
  await capture(page, info, 'file-offline');
  expect(errors).toEqual([]);
});

test('touch selection, busy gate and error recovery remain usable', async ({
  browser,
}, info) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 800 },
    hasTouch: true,
    isMobile: info.project.name !== 'firefox',
  });
  const page = await context.newPage();
  try {
    await page.goto(app.url);
    const button = page.getByRole('button', {
      name: 'Choose a PHAR or ZIP file',
    });
    const pending = page.waitForEvent('filechooser');
    await button.tap();
    const picker = await pending;
    await picker.setFiles({
      name: 'broken.zip',
      mimeType: 'application/zip',
      buffer: Buffer.from('PK broken'),
    });
    await expect(page.getByRole('status')).toContainText('damaged');
    // Delay only the user File.arrayBuffer boundary to observe the real loading controls.
    await page.evaluate(() => {
      const value: unknown = Reflect.get(File.prototype, 'arrayBuffer');
      if (typeof value !== 'function')
        throw new Error('Missing File.arrayBuffer');
      const original = value as (this: File) => Promise<ArrayBuffer>;
      File.prototype.arrayBuffer = async function () {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return original.call(this);
      };
    });
    const download = page.waitForEvent('download');
    await upload(page);
    await expect(button).toBeDisabled();
    await expect(page.locator('#conversion-progress')).toBeVisible();
    await capture(page, info, 'touch-loading');
    await download;
    await expect(button).toBeEnabled();
    await expect(page.locator('#conversion-progress')).toBeHidden();
    await expect(page.getByRole('status')).toContainText('3 files checked');
    await capture(page, info, 'touch-success');
  } finally {
    await context.close();
  }
});
