import Zip from 'jszip';
import * as inflate from 'pako';
Object.defineProperty(globalThis, 'JSZip', { value: Zip });
Object.defineProperty(globalThis, 'pako', { value: inflate });
await import('../archive.js');
export const api = Unphar;
export const entries: ArchiveEntry[] = [
  {
    name: 'hello.txt',
    data: new TextEncoder().encode('Hello VINASIG'),
    mtime: 1700000000,
  },
  {
    name: 'nested/tiếng-việt.txt',
    data: new TextEncoder().encode('Siêu trí tuệ'),
    mtime: 1700000000,
  },
  { name: 'empty.txt', data: new Uint8Array(), mtime: 1700000000 },
];
export async function zipFixture(
  compression: 'STORE' | 'DEFLATE' = 'STORE',
  paths = entries,
): Promise<Uint8Array<ArrayBuffer>> {
  const zip = new Zip();
  for (const entry of paths)
    zip.file(entry.name, entry.data, {
      createFolders: false,
      date: new Date(entry.mtime * 1000),
    });
  return new Uint8Array(
    await zip.generateAsync({ type: 'uint8array', compression }),
  );
}
