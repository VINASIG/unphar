import assert from 'node:assert/strict';
import { mkdir, readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { FileSystemConfigLoader, HtmlValidate } from 'html-validate';
import {
  digest,
  parseJson,
  record,
  text,
  localPath,
  readLocal,
  repositoryRoot,
  writeOutput,
} from './local.ts';

export async function siteFiles(): Promise<string[]> {
  const result = [
    'index.html',
    'vi/index.html',
    'copy.js',
    'theme-init.js',
    'preferences.js',
    'preferences.css',
    'style.css',
    'control-surfaces.css',
    'tokens.css',
    'archive.js',
    'script.js',
    'robots.txt',
    'sitemap.xml',
  ];
  async function walk(relative: string): Promise<void> {
    for (const entry of await readdir(
      await localPath(repositoryRoot, relative),
      { withFileTypes: true },
    )) {
      assert(!entry.isSymbolicLink(), 'Assets must not be symlinks');
      const filename = `${relative}/${entry.name}`;
      if (entry.isDirectory()) await walk(filename);
      else result.push(filename);
    }
  }
  await walk('assets');
  return result;
}

const files = await siteFiles();
const assets = record(
  parseJson(await readLocal(repositoryRoot, 'assets/manifest.json')),
);
const expected = record(assets['files']);
for (const [filename, hash] of Object.entries(expected))
  assert.equal(
    digest(await readLocal(repositoryRoot, filename)),
    text(hash),
    `Asset digest mismatch: ${filename}`,
  );
const dependencies = record(
  record(parseJson(await readLocal(repositoryRoot, 'package.json')))[
    'dependencies'
  ],
);
const versions = record(assets['runtimeVersions']);
for (const name of ['jszip', 'pako']) {
  assert.equal(
    versions[name],
    dependencies[name],
    `Vendor version mismatch: ${name}`,
  );
  assert.equal(
    record(
      parseJson(
        await readLocal(repositoryRoot, `node_modules/${name}/package.json`),
      ),
    )['version'],
    dependencies[name],
    `Installed version mismatch: ${name}`,
  );
}
const dist = await localPath(repositoryRoot, 'dist', true);
await mkdir(dist, { recursive: true });
for (const filename of files) {
  const target = await localPath(repositoryRoot, `dist/${filename}`, true);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(await localPath(repositoryRoot, filename), target);
}
// A whitelist keeps source archives, development packages and agent backups off Pages.
async function verifyDirectory(relative: string): Promise<void> {
  for (const entry of await readdir(await localPath(repositoryRoot, relative), {
    withFileTypes: true,
  })) {
    const filename = `${relative}/${entry.name}`;
    if (entry.isDirectory()) await verifyDirectory(filename);
    else
      assert(
        files.includes(filename.slice(5)),
        `Unexpected publication file: ${filename}`,
      );
  }
}
await verifyDirectory('dist');
const validator = new HtmlValidate(new FileSystemConfigLoader());
const normalizeBootstrap = (source: string) =>
  source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .join('\n')
    .trim();
const bootstrap = normalizeBootstrap(
  (await readLocal(repositoryRoot, 'theme-init.js')).toString('utf8'),
);
for (const page of ['index.html', 'vi/index.html']) {
  const report = await validator.validateFile(path.join(dist, page));
  assert(report.valid, JSON.stringify(report.results));
  const html = (await readLocal(repositoryRoot, `dist/${page}`)).toString(
    'utf8',
  );
  const inline = /<script data-theme-init>([\s\S]*?)<\/script>/.exec(html)?.[1];
  assert(inline, `Missing inline theme bootstrap in ${page}`);
  assert.equal(
    normalizeBootstrap(inline),
    bootstrap,
    `Inline theme bootstrap drift in ${page}`,
  );
}
for (const filename of files)
  assert(
    (await readLocal(repositoryRoot, filename)).equals(
      await readLocal(repositoryRoot, `dist/${filename}`),
    ),
    `Build changed ${filename}`,
  );
await writeOutput(
  repositoryRoot,
  'output/checks/build.json',
  `${JSON.stringify({ status: 'PASS', files: files.length, publication: 'dist only' }, null, 2)}\n`,
);
console.log(`Static build passed: ${String(files.length)} publication files.`);
