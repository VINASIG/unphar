import { defineConfig } from 'eslint/config';
import base from './.vinasig/standards/configs/eslint.mjs';

export default defineConfig(
  base,
  { ignores: ['assets/**', 'package/**', '*min.js', 'favicon_io/**'] },
  {
    files: [
      'archive.js',
      'script.js',
      'copy.js',
      'preferences.js',
      'theme-init.js',
      'scripts/**/*.ts',
      'tests/**/*.ts',
      'types/**/*.d.ts',
      'playwright.config.ts',
    ],
    languageOptions: {
      globals: {
        JSZip: 'readonly',
        pako: 'readonly',
        Unphar: 'readonly',
        UnpharCopy: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        URL: 'readonly',
        crypto: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLProgressElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        performance: 'readonly',
        Buffer: 'readonly',
        process: 'readonly',
      },
    },
  },
);
