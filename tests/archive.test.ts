import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { api, entries, zipFixture } from './setup.ts';

void test('CRC32 uses the standard test vector', () => {
  assert.equal(api.crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
});
void test('the generated PHAR has a real SHA-256 signature', async () => {
  const bytes = await api.buildPhar(entries);
  assert.equal(Buffer.from(bytes.slice(-4)).toString(), 'GBMB');
  assert.equal(new DataView(bytes.buffer).getUint32(bytes.length - 8, true), 3);
  assert.deepEqual(
    Buffer.from(bytes.slice(-40, -8)),
    createHash('sha256').update(bytes.slice(0, -40)).digest(),
  );
  assert.deepEqual(await api.parsePhar(bytes), entries);
});
for (const compression of ['STORE', 'DEFLATE'] as const) {
  void test(`${compression} ZIP preserves UTF-8 names, empty files and bytes`, async () => {
    assert.deepEqual(await api.readZip(await zipFixture(compression)), entries);
  });
  void test(`${compression} ZIP to PHAR to ZIP round trip checks every file`, async () => {
    const result = await api.convert(await zipFixture(compression));
    assert.equal(result.format, 'phar');
    const back = await api.convert(result.bytes);
    assert.equal(back.format, 'zip');
    assert.deepEqual(await api.readZip(back.bytes), entries);
  });
}
void test('a corrupted PHAR signature fails', async () => {
  const bytes = await api.buildPhar(entries);
  const index = bytes.length - 40;
  bytes[index] = (bytes[index] ?? 0) ^ 1;
  await assert.rejects(api.parsePhar(bytes), /signature/);
});
void test('a truncated PHAR fails with a useful error', async () => {
  const bytes = await api.buildPhar(entries);
  await assert.rejects(api.parsePhar(bytes.slice(0, 35)), /truncated|length/);
});
void test('invalid input is rejected without trusting the extension', async () => {
  await assert.rejects(
    api.convert(new TextEncoder().encode('invalid')),
    /PHAR/,
  );
});
void test('invalid ZIP is rejected', async () => {
  await assert.rejects(
    api.readZip(new TextEncoder().encode('PK invalid')),
    /damaged/,
  );
});
void test('oversized input is rejected before parsing', async () => {
  await assert.rejects(
    api.convert(new Uint8Array(api.limits.input + 1)),
    /32 MB/,
  );
});
void test('oversized expanded file is rejected', async () => {
  await assert.rejects(
    api.buildPhar([
      {
        name: 'large.bin',
        data: new Uint8Array(api.limits.entry + 1),
        mtime: 1700000000,
      },
    ]),
    /limits/,
  );
});
void test('excessive entry count is rejected', async () => {
  await assert.rejects(
    api.buildPhar(
      Array.from({ length: 2001 }, (_, i) => ({
        name: `file-${String(i)}`,
        data: new Uint8Array(),
        mtime: 1700000000,
      })),
    ),
    /2,000/,
  );
});
void test('duplicates and invalid timestamps are rejected', async () => {
  assert(entries[0]);
  await assert.rejects(api.buildPhar([entries[0], entries[0]]), /duplicate/);
  await assert.rejects(
    api.buildPhar([{ ...entries[0], mtime: NaN }]),
    /timestamp/,
  );
});
void test('ZIP CRC damage is rejected', async () => {
  const bytes = await zipFixture();
  const at = Buffer.from(bytes).indexOf('Hello VINASIG');
  assert(at > 0);
  bytes[at] = (bytes[at] ?? 0) ^ 1;
  await assert.rejects(api.readZip(bytes), /CRC32/);
});
void test('deflate bombs cannot exceed their declared output size', async () => {
  const bytes = await zipFixture('DEFLATE', [
    { name: 'bomb.txt', data: new Uint8Array(200000), mtime: 1700000000 },
  ]);
  const view = new DataView(bytes.buffer);
  const central = Buffer.from(bytes).indexOf(
    Buffer.from([0x50, 0x4b, 0x01, 0x02]),
  );
  view.setUint32(22, 1, true);
  view.setUint32(central + 24, 1, true);
  await assert.rejects(api.readZip(bytes), /declared size/);
});
void test('empty ZIP archives are rejected', async () => {
  await assert.rejects(api.readZip(await zipFixture('STORE', [])), /entries/);
});
void test('ZIP64 and encrypted ZIP headers are rejected explicitly', async () => {
  const zip64 = await zipFixture();
  const end = zip64.length - 22;
  new DataView(zip64.buffer).setUint16(end + 10, 0xffff, true);
  await assert.rejects(api.readZip(zip64), /ZIP64/);
  const encrypted = await zipFixture();
  const central = Buffer.from(encrypted).indexOf(
    Buffer.from([0x50, 0x4b, 0x01, 0x02]),
  );
  assert(central > 0);
  new DataView(encrypted.buffer).setUint16(central + 8, 1, true);
  await assert.rejects(api.readZip(encrypted), /Encrypted/);
});
void test('the PHP manifest format limit is enforced before writing', async () => {
  const files = Array.from({ length: 300 }, (_, i) => ({
    name: `${String(i)}-${'a'.repeat(4000)}`,
    data: new Uint8Array(),
    mtime: 1700000000,
  }));
  await assert.rejects(api.buildPhar(files), /manifest.*1 MB/);
});
for (const name of [
  '../secret.txt',
  '/absolute.txt',
  'C:/secret.txt',
  'a\\b.txt',
  'a/../b.txt',
  'a//b.txt',
  'a\0b.txt',
]) {
  void test(`unsafe archive path ${JSON.stringify(name)} is rejected`, async () => {
    assert.throws(() => api.safePath(name), /unsafe/);
    await assert.rejects(
      api.readZip(
        await zipFixture('STORE', [
          { name, data: new Uint8Array([1]), mtime: 1700000000 },
        ]),
      ),
      /unsafe/,
    );
  });
}
