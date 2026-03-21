export interface FileOptions {
    /**
     * File metadata
     * @type {string}
     */
    metadata?: string;
    /**
     * Compression type
     * @type {number}
     */
    compressionType?: number;
    /**
     * File permission
     * @type {number}
     */
    permission?: number;
    /**
     * Timestamp of the file
     * @type {number}
     */
    timestamp?: number;
    /**
     * Is given contents already compressed
     * @type {boolean}
     */
    isCompressed?: boolean;
}
/**
 * A single file within a phar archive
 * @class PharFile
 */
export default class File {
    /**
     * File name
     * @type {string}
     */
    private name;
    /**
     * File metadata
     * @type {string}
     */
    private metadata;
    /**
     * File content
     * @type {string}
     */
    private contents;
    /**
     * Compression type
     * @type {number}
     */
    private compressionType;
    /**
     * File permission
     * @type {number}
     */
    private permission;
    /**
     * Timestamp of the file
     * @type {number}
     */
    private timestamp;
    /**
     * Is given contents already compressed
     * @type {boolean}
     */
    private isCompressed;
    /**
     * @constructor
     * @param {string} name filename (path)
     * @param {string} contents file contents
     * @param {FileOptions?} options file options
     */
    constructor(name: string, contents: string, options?: FileOptions);
    /**
     * Get filename (path)
     * @returns {string}
     */
    getName(): string;
    /**
     * Set filename (path)
     * @param {string} name
     */
    setName(name: string): this;
    /**
     * Get file contents
     * @returns {string}
     */
    getContents(): string;
    /**
     * Set file contents
     * @param {string} contents
     * @param {boolean} isCompressed is given contents already compressed
     */
    setContents(contents: string, isCompressed: boolean): this;
    /**
     * Get file compressed contents
     * @returns {string}
     */
    getCompressedContents(): string;
    /**
     * Get file size
     * @returns {number}
     */
    getSize(): number;
    /**
     * Get file compressed size
     * @returns {number}
     */
    getComressedSize(): number;
    /**
     * Get file compression type
     * @returns {number}
     */
    getCompressionType(): number;
    /**
     * Set compression type
     * @param {number} type
     */
    setCompressionType(type: number): this;
    /**
     * Get file permission
     * @returns {number}
     */
    getPermission(): number;
    /**
     * Set file permission
     * @param {number} perm
     */
    setPermission(perm: number): this;
    /**
     * Get phar flags
     * @returns {number}
     */
    getPharFlags(): number;
    /**
     * Get file timestamp
     * @returns {number}
     */
    getTimestamp(): number;
    /**
     * Set file timestamp
     * @param {number} time
     */
    setTimestamp(time: number): this;
    /**
     * Get file metadata
     * @returns {string}
     */
    getMetadata(): string;
    /**
     * Set file metadata
     * @param {string} metadata
     */
    setMetadata(metadata: string): this;
}
//# sourceMappingURL=File.d.ts.map