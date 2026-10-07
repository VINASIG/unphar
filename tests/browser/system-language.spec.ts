import path from 'node:path';
import { test, expect } from '@playwright/test';
import { startServer } from '../../scripts/serve.ts';

test('system-language navigation waits for complete interface parsing', async ({
  browser,
}) => {
  const app = await startServer(path.resolve('dist'));
  const context = await browser.newContext({ locale: 'vi-VN' });
  const errors: string[] = [];
  try {
    const page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    for (let load = 0; load < 5; load++) {
      await page.goto(app.url);
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
      await expect(page.locator('#choose-file')).toBeEnabled();
      await expect(page.locator('#archive-input')).toBeAttached();
    }
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await app.close();
  }
});
