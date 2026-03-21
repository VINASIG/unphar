import { Signature } from './Const';
import File from './File';
export interface ArhiveOptions {
    /**
     * Alias for the phar
     * @type {string}
     */
    alias?: string;
    /**
     * Bootstrap stub
     * @type {string}
     */
    stub?: string;
    /**
     * Signature type
     * @type {number}
     */
    signatureType?: number;
    /**
     * Metadata
     * @type {string}
     */
    metadata?: string;
    /**
     * Phar files
     * @type {File[]}
     */
    files?: File[];
    /**
     * Flags
     * @type {number}
     */
    flags?: number;
    /**
     * manifest API version
     * @type {number}
     */
    manifestApi?: number;
}
/**
 * Phar class
 * @class Phar
 */
export default class Archive {
    /**
     * Alias for the phar
     * @type {string}
     */
    private alias;
    /**
     * Bootstrap stub
     * @type {string}
     */
    private stub;
    /**
     * Signature type
     * @type {number}
     */
    private signatureType;
    /**
     * Metadata
     * @type {string}
     */
    private metadata;
    /**
     * Phar files
     * @type {File[]}
     */
    private files;
    /**
     * Flags
     * @type {number}
     */
    private flags;
    /**
     * manifest API version
     * @type {number}
     */
    private manifestApi;
    /**
     * Phar
     * @constructor
     * @param {ArhiveOptions} options phar options
     */
    constructor(options?: ArhiveOptions);
    /**
     * Get stub
     * @returns {string}
     */
    getStub(): string;
    /**
     * Set stub
     * @param {string} stub
     */
    setStub(stub: string): this;
    /**
     * Get alias
     * @returns {string}
     */
    getAlias(): string;
    /**
     * Set alias
     * @param {string} alias
     */
    setAlias(alias: string): this;
    /**
     * Get signature type
     * @returns {number}
     */
    getSignatureType(): number;
    /**
     * Set signature type
     * @param {number} type
     */
    setSignatureType(type: Signature): this;
    /**
     * Get metadata
     * @returns {string}
     */
    getMetadata(): string;
    /**
     * Set metadata
     * @param {string} meta
     */
    setMetadata(meta: string): this;
    /**
     * Add file
     * @param {File} file
     */
    addFile(file: File): this;
    /**
     * Get file
     * @param {string} name
     * @returns {File?}
     */
    getFile(name: string): File | undefined;
    /**
     * Remove file
     * @param {string} name
     */
    removeFile(name: string): this;
    /**
     * Get all files
     * @returns {File[]}
     */
    getFiles(): File[];
    /**
     * Set all files
     * @param {File[]} files
     */
    setFiles(files: File[]): this;
    /**
     * Get files count
     * @returns {number}
     */
    getFilesCount(): number;
    /**
     * Get phar flags
     * @returns {number}
     */
    getFlags(): number;
    /**
     * Set phar flags
     * @param {number} flags
     */
    setFlags(flags: number): this;
    /**
     * Get manifest API version
     * @returns {number}
     */
    getManifestApi(): number;
    /**
     * Set manifest API version
     * @param {number} api
     */
    setManifestApi(api: number): this;
    /**
     * Load phar from contents
     * @param {(string|Uint8Array)} buffer phar contents
     */
    loadPharData(buffer: string | Uint8Array): this;
    /**
     * Save phar file contents
     * @param {boolean} asU8A save result as Uint8Array (Default true)
     * @returns {string|Uint8Array} phar contents
     */
    savePharData(asU8A?: boolean): string | Uint8Array;
}
