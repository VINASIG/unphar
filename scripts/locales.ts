import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';
import dictionary from '../locales/vi.json' with { type: 'json' };
import { translateHtml } from './localization.ts';

const root = path.resolve(import.meta.dirname, '..');

export async function vietnamesePage(): Promise<string> {
  const source = await readFile(path.join(root, 'index.html'), 'utf8');
  let html = translateHtml(source, dictionary)
    .replace('<html lang="en">', '<html lang="vi">')
    .replace(
      'rel="canonical" href="https://unphar.vinasig.io.vn/"',
      'rel="canonical" href="https://unphar.vinasig.io.vn/vi/"',
    )
    .replace(
      'property="og:url" content="https://unphar.vinasig.io.vn/"',
      'property="og:url" content="https://unphar.vinasig.io.vn/vi/"',
    )
    .replace('content="en_US"', 'content="vi_VN"')
    .replace('"inLanguage": "en"', '"inLanguage": "vi"')
    .replace(
      '"url": "https://unphar.vinasig.io.vn/"',
      '"url": "https://unphar.vinasig.io.vn/vi/"',
    )
    .replace(
      '"description": "Convert PHAR and ZIP archives locally in your browser without uploading archive contents."',
      '"description": "Chuyển đổi tệp PHAR và ZIP ngay trong trình duyệt mà không tải nội dung lên máy chủ."',
    );
  html = html.replace(
    /\b(href|src|srcset)="(?!#|\/|[a-z]+:)([^"]+)"/gi,
    '$1="../$2"',
  );
  html = html.replace(
    /<a\b[^>]*class="language-switch"[^>]*>[\s\S]*?<\/a\s*>/,
    '<a class="language-switch" href="../" hreflang="en" lang="vi" aria-label="Đọc trang này bằng tiếng Anh" data-copy-notation="ISO 639-1 language code">EN</a>',
  );
  return format(html, {
    ...(await resolveConfig(path.join(root, 'vi/index.html'))),
    parser: 'html',
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const expected = await vietnamesePage();
  const runtime = await format(
    '(() => {\n/** @type {Readonly<Record<string,string>>} */\nconst dictionary = ' +
      JSON.stringify(dictionary) +
      ';\nObject.defineProperty(globalThis, "UnpharCopy", { value: Object.freeze({ /** @param {string} value */ translate(value) { return document.documentElement.lang === "vi" ? dictionary[value] ?? value : value; } }) });\n})();\n',
    { ...(await resolveConfig(path.join(root, 'copy.js'))), parser: 'babel' },
  );
  for (const [relative, contents] of [
    ['vi/index.html', expected],
    ['copy.js', runtime],
  ]) {
    assert(relative && contents);
    const filename = path.join(root, relative);
    if (process.argv.includes('--write')) {
      await mkdir(path.dirname(filename), { recursive: true });
      await writeFile(filename, contents);
    } else {
      assert.equal(
        await readFile(filename, 'utf8'),
        contents,
        'Locale output drift. Run npm run generate:locales.',
      );
    }
  }
  console.log(
    'Vietnamese page matches the shared template and reviewed dictionary.',
  );
}
