import path from 'node:path';
import { test, expect } from '@playwright/test';
import { startServer } from '../../scripts/serve.ts';
import {
  inspectInterface,
  inspectHeaderBrand,
} from '../../.vinasig/standards/templates/web/interface.mjs';
import { captureFullPage } from '../../.vinasig/standards/templates/web/responsive.mjs';
let app: Awaited<ReturnType<typeof startServer>>;
test.beforeAll(async () => {
  app = await startServer(path.resolve('dist'));
});
test.afterAll(async () => {
  await app.close();
});
for (const route of [''])
  for (const theme of ['light', 'dark'] as const)
    for (const [width, height] of [
      [320, 800],
      [360, 800],
      [390, 844],
      [768, 1024],
      [1024, 768],
      [1440, 900],
    ] as const) {
      test(
        'interface copy ' +
          (route || 'home') +
          ' ' +
          theme +
          ' ' +
          String(width),
        async ({ page }, info) => {
          await page.setViewportSize({ width, height });
          await page.emulateMedia({
            colorScheme: theme,
            reducedMotion: 'reduce',
          });
          await page.goto(new URL(route, app.url).href);
          await captureFullPage(page, info, 'initial');
          expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
          const brand = page.locator('[data-brand-logo]');
          await brand.focus();
          await expect(brand).toBeFocused();
          expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
          await brand.hover();
          expect(await page.evaluate(inspectHeaderBrand)).toEqual([]);
          expect(await page.evaluate(inspectInterface)).toEqual([]);
          for (const disclosure of await page.locator('details').all()) {
            if (
              (await disclosure.isVisible()) &&
              (await disclosure.getAttribute('open')) === null
            )
              await disclosure.locator('summary').click();
          }
          await captureFullPage(page, info, 'expanded');
          expect(await page.evaluate(inspectInterface)).toEqual([]);

          const widths = await page.evaluate(() => [
            document.documentElement.scrollWidth,
            document.documentElement.clientWidth,
          ]);
          expect(widths[0]).toBeLessThanOrEqual((widths[1] ?? 0) + 1);
        },
      );
    }
