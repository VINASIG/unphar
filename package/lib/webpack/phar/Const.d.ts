/**
 * Compression flags for phar files
 */
export declare enum Compression {
    NONE = 0,
    GZ = 4096,
    BZIP2 = 8192
}
/**
 * Signature types for phar
 */
export declare enum Signature {
    MD5 = 1,
    SHA1 = 2,
    SHA256 = 4,
    SHA512 = 8
}
declare const _default: {
    SUPPORTED_COMPRESSION: Compression[];
    /**
     * End of the phar file (magic)
     * @property {string} END_MAGIC
     * @readonly
     */
    END_MAGIC: string;
    /**
     * End of the stub
     * *
     * @property {string} STUB_END
     * @readonly
     */
    STUB_END: string;
};
export default _default;
