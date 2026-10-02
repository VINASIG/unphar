import type Zip from 'jszip';
import type * as Pako from 'pako';
declare global {
  interface ArchiveEntry {
    name: string;
    data: Uint8Array<ArrayBuffer>;
    mtime: number;
  }
  interface ArchiveResult {
    bytes: Uint8Array<ArrayBuffer>;
    names: string[];
    format: 'phar' | 'zip';
  }
  interface UnpharApi {
    readonly limits: {
      input: number;
      expanded: number;
      entry: number;
      count: number;
      ratio: number;
    };
    crc32(bytes: Uint8Array): number;
    safePath(name: string): string;
    parsePhar(bytes: Uint8Array<ArrayBuffer>): Promise<ArchiveEntry[]>;
    buildPhar(entries: ArchiveEntry[]): Promise<Uint8Array<ArrayBuffer>>;
    readZip(bytes: Uint8Array<ArrayBuffer>): Promise<ArchiveEntry[]>;
    convert(bytes: Uint8Array<ArrayBuffer>): Promise<ArchiveResult>;
  }
  const JSZip: typeof Zip;
  const pako: typeof Pako;
  const Unphar: UnpharApi;
}
