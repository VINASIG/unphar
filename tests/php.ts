import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { api, entries } from './setup.ts';
import { repositoryRoot, writeOutput } from '../scripts/local.ts';

await mkdir(path.join(repositoryRoot, 'output/fixtures'), { recursive: true });
const root = await mkdtemp(path.join(repositoryRoot, 'output/fixtures/php-'));
const generated = path.join(root, 'generated.phar');
await writeFile(generated, await api.buildPhar(entries));
const reader = path.join(root, 'read.php');
await writeFile(
  reader,
  `<?php
$p = new Phar($argv[1]);
if ($p->getSignature()['hash_type'] !== 'SHA-256') { throw new Exception('Wrong signature'); }
foreach (['hello.txt' => 'Hello VINASIG', 'nested/tiếng-việt.txt' => 'Siêu trí tuệ', 'empty.txt' => ''] as $name => $content) {
  if ($p[$name]->getContent() !== $content) { throw new Exception('Content mismatch'); }
}
echo 'PHP verified SHA-256 and all file contents';
`,
);
const verification = execFileSync('php', [reader, generated], {
  encoding: 'utf8',
});
assert.match(verification, /verified/);
const writer = path.join(root, 'write.php');
await writeFile(
  writer,
  `<?php
$p = new Phar($argv[1]);
$p->startBuffering();
$p->addFromString('hello.txt', 'Hello VINASIG');
$p->addFromString('nested/tiếng-việt.txt', 'Siêu trí tuệ');
$p->addFromString('empty.txt', '');
$p->setStub("<?php /* Tiếng Việt */ __HALT_COMPILER(); ?>\\r\\n");
$p->setSignatureAlgorithm((int)$argv[2]);
if ($argv[3] === 'compressed') { $p->compressFiles(Phar::GZ); }
$p->stopBuffering();
`,
);
for (const signature of [2, 3, 4])
  for (const compression of ['plain', 'compressed']) {
    const file = path.join(
      root,
      `native-${String(signature)}-${compression}.phar`,
    );
    execFileSync(
      'php',
      ['-d', 'phar.readonly=0', writer, file, String(signature), compression],
      { encoding: 'utf8' },
    );
    const parsed = await api.parsePhar(new Uint8Array(await readFile(file)));
    assert.equal(parsed.length, 3);
    for (const entry of entries)
      assert.deepEqual(
        parsed.find((value) => value.name === entry.name)?.data,
        entry.data,
      );
  }
const version = execFileSync('php', ['-v'], { encoding: 'utf8' }).split(
  '\n',
)[0];
await writeOutput(
  repositoryRoot,
  'output/checks/php.json',
  `${JSON.stringify({ status: 'PASS', version, verification, fixtures: 6, executedArchiveStub: false }, null, 2)}\n`,
);
console.log(`${verification}; read 6 independently generated PHP fixtures.`);
