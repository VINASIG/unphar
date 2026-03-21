import Archive from './phar/Archive';
import * as JSZip from 'jszip';
import { Compression } from './phar/Const';
/**
 * Convert Phar to Zip
 * @property {Archive} phar
 * @returns {JSZip} zip data
 */
export declare function toZip(phar: Archive): Promise<JSZip>;
/**
 * Convert Zip to Phar
 * @property {(string|Uint8Array)} data
 * @returns {Archive}
 */
export declare function toPhar(data: string | Uint8Array, compressionType?: Compression, password?: string): Promise<Archive>;
//# sourceMappingURL=ZipConverter.d.ts.map