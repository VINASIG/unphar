import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { startServer } from '../../scripts/serve.ts';
import { api, zipFixture, entries } from '../setup.ts';
let app: Awaited<ReturnType<typeof startServer>>;
test.beforeAll(async () => {
  app = await startServer(path.resolve('dist'));
});
test.afterAll(async () => {
  await app.close();
});
for (const theme of ['light', 'dark'] as const)
  test(
    'Vietnamese conversion, preserved names and validation ' + theme,
    async ({ page }, info) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(new URL('vi/', app.url).href);
      const requests: string[] = [];
      page.on('request', (request) => {
        if (
          !/^(?:blob:|data:)/.test(request.url()) &&
          ![
            'assets/brand/reversed.svg',
            'assets/brand/primary-color.svg',
            'assets/brand/mark.svg',
          ].some((asset) => request.url() === new URL(asset, app.url).href)
        )
          requests.push(request.url());
      });
      await page.locator('#archive-input').setInputFiles({
        name: 'invalid.zip',
        mimeType: 'application/zip',
        buffer: Buffer.from('invalid'),
      });
      await expect(page.locator('#conversion-status')).toHaveText(
        'Đây không phải tệp PHAR dạng gốc được hỗ trợ.',
      );
      await expect(page.locator('#conversion-status')).not.toContainText(
        'This ',
      );
      const forward = page.waitForEvent('download');
      await page.locator('#archive-input').setInputFiles({
        name: 'Archive contents.zip',
        mimeType: 'application/zip',
        buffer: Buffer.from(await zipFixture()),
      });
      const pharFile = await (await forward).path();
      assert(pharFile);
      const phar = new Uint8Array(await readFile(pharFile));
      expect((await api.parsePhar(phar)).map((entry) => entry.name)).toEqual(
        entries.map((entry) => entry.name),
      );
      await expect(page.locator('#selected-filename')).toHaveText(
        'Archive contents.zip',
      );
      await page.locator('#contents-summary').click();
      await expect(page.locator('#file-list')).toContainText(
        'nested/tiếng-việt.txt',
      );
      await page.locator('[data-theme-toggle]').click();
      await expect(page.locator('#download-file')).toBeVisible();
      const backward = page.waitForEvent('download');
      await page.locator('#archive-input').setInputFiles({
        name: 'sample.phar',
        mimeType: 'application/octet-stream',
        buffer: Buffer.from(phar),
      });
      const zipFile = await (await backward).path();
      assert(zipFile);
      const back = await api.readZip(new Uint8Array(await readFile(zipFile)));
      expect(back.map((entry) => entry.name)).toEqual(
        entries.map((entry) => entry.name),
      );
      for (const [index, entry] of entries.entries())
        expect(back[index]?.data).toEqual(entry.data);
      await expect(page.locator('#conversion-status')).toContainText('tệp');
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await page.screenshot({
        path: info.outputPath('vi-roundtrip-' + theme + '.png'),
        fullPage: true,
      });
      expect(requests).toEqual([]);
    },
  );
