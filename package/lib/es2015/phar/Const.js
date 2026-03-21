/**
 * Compression flags for phar files
 */
export var Compression;
(function (Compression) {
    Compression[Compression["NONE"] = 0] = "NONE";
    Compression[Compression["GZ"] = 4096] = "GZ";
    Compression[Compression["BZIP2"] = 8192] = "BZIP2";
})(Compression || (Compression = {}));
/**
 * Signature types for phar
 */
export var Signature;
(function (Signature) {
    Signature[Signature["MD5"] = 1] = "MD5";
    Signature[Signature["SHA1"] = 2] = "SHA1";
    Signature[Signature["SHA256"] = 4] = "SHA256";
    Signature[Signature["SHA512"] = 8] = "SHA512";
})(Signature || (Signature = {}));
export default {
    SUPPORTED_COMPRESSION: [Compression.NONE, Compression.GZ],
    /**
     * End of the phar file (magic)
     * @property {string} END_MAGIC
     * @readonly
     */
    END_MAGIC: 'GBMB',
    /**
     * End of the stub
     * *
     * @property {string} STUB_END
     * @readonly
     */
    STUB_END: '__HALT_COMPILER(); ?>\r\n',
};
