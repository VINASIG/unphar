var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Archive from './phar/Archive';
import File from './phar/File';
import { toUint8Array, fromUint8Array } from './Utils';
import * as JSZip from 'jszip';
import { Compression } from './phar/Const';
/**
 * Convert Phar to Zip
 * @property {Archive} phar
 * @returns {JSZip} zip data
 */
export function toZip(phar) {
    return __awaiter(this, void 0, void 0, function* () {
        const zip = new JSZip(), files = phar.getFiles();
        files.forEach((file) => {
            const date = new Date();
            date.setTime(file.getTimestamp() * 1000);
            zip.file(file.getName(), toUint8Array(file.getContents()), {
                date
            });
        });
        return zip;
    });
}
/**
 * Convert Zip to Phar
 * @property {(string|Uint8Array)} data
 * @returns {Archive}
 */
export function toPhar(data, compressionType = Compression.NONE, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceZip = new JSZip();
        let zip;
        const phar = new Archive();
        try {
            zip = yield sourceZip.loadAsync((data instanceof Uint8Array) ? data : toUint8Array(data));
        }
        catch (error) {
            throw Error(`JSZip creation error: ${error}`);
        }
        try {
            const files = [];
            zip.forEach((path, file) => files.push(file));
            for (const file of files)
                phar.addFile(new File(file.name, fromUint8Array(yield file.async('uint8array')), {
                    compressionType,
                    timestamp: file.date.getDate(),
                }));
        }
        catch (error) {
            throw Error(`JSZip decompression error: ${error}`);
        }
        return phar;
    });
}
