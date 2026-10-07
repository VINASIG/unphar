import assert from 'node:assert/strict';
import { mkdir, readdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { FileSystemConfigLoader, HtmlValidate } from 'html-validate';
import { version as compilerVersion } from 'esbuild';
import {
  preparePublicationHtml,
  publicationStyles,
  publicationScripts,
  minifyPublicationSource,
  normalizeBootstrap,
} from './site-styles.ts';
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
    'site-chrome.css',
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
assert.equal(
  compilerVersion,
  record(
    record(parseJson(await readLocal(repositoryRoot, 'package.json')))[
      'devDependencies'
    ],
  )['esbuild'],
  'Compiler version drift',
);
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
const styleSources = Object.fromEntries(
  await Promise.all(
    publicationStyles.map(async (filename) => [
      filename,
      (await readLocal(repositoryRoot, filename)).toString('utf8'),
    ]),
  ),
) as Record<(typeof publicationStyles)[number], string>;
const bootstrap = (await readLocal(repositoryRoot, 'theme-init.js')).toString(
  'utf8',
);
const publicationBytes = async (filename: string): Promise<Buffer> => {
  const bytes = await readLocal(repositoryRoot, filename);
  if (filename === 'index.html' || filename === 'vi/index.html')
    return Buffer.from(
      await preparePublicationHtml(
        bytes.toString('utf8'),
        styleSources,
        filename === 'vi/index.html' ? '../' : '',
        bootstrap,
      ),
      'utf8',
    );
  if (publicationScripts.some((script) => script === filename))
    return Buffer.from(
      await minifyPublicationSource(bytes.toString('utf8'), 'js'),
      'utf8',
    );
  return bytes;
};
for (const filename of files) {
  const target = await localPath(repositoryRoot, `dist/${filename}`, true);
  await mkdir(path.dirname(target), { recursive: true });
  if (
    filename === 'index.html' ||
    filename === 'vi/index.html' ||
    publicationScripts.some((script) => script === filename)
  )
    await writeFile(target, await publicationBytes(filename));
  else await copyFile(await localPath(repositoryRoot, filename), target);
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
const compiledBootstrap = normalizeBootstrap(
  await minifyPublicationSource(bootstrap, 'js'),
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
    compiledBootstrap,
    `Inline theme bootstrap drift in ${page}`,
  );
}
for (const filename of files)
  assert(
    (await publicationBytes(filename)).equals(
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
