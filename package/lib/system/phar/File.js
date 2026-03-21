System.register(["./Const", "../Utils", "pako"], function (exports_1, context_1) {
    "use strict";
    var Const_1, Utils_1, pako_1, File;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Const_1_1) {
                Const_1 = Const_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (pako_1_1) {
                pako_1 = pako_1_1;
            }
        ],
        execute: function () {
            /**
             * A single file within a phar archive
             * @class PharFile
             */
            File = /** @class */ (function () {
                /**
                 * @constructor
                 * @param {string} name filename (path)
                 * @param {string} contents file contents
                 * @param {FileOptions?} options file options
                 */
                function File(name, contents, options) {
                    if (options === void 0) { options = {}; }
                    this.name = name || 'file';
                    this.setCompressionType(options.compressionType || Const_1.Compression.NONE);
                    this.setContents(contents || '', options.isCompressed || false);
                    this.setTimestamp(options.timestamp || -1);
                    this.setPermission(options.permission || 438); // linux filesystem permission 0666
                    this.metadata = options.metadata || '';
                    return this;
                }
                /**
                 * Get filename (path)
                 * @returns {string}
                 */
                File.prototype.getName = function () {
                    return this.name;
                };
                /**
                 * Set filename (path)
                 * @param {string} name
                 */
                File.prototype.setName = function (name) {
                    this.name = name;
                    return this;
                };
                /**
                 * Get file contents
                 * @returns {string}
                 */
                File.prototype.getContents = function () {
                    return this.contents;
                };
                /**
                 * Set file contents
                 * @param {string} contents
                 * @param {boolean} isCompressed is given contents already compressed
                 */
                File.prototype.setContents = function (contents, isCompressed) {
                    if (isCompressed) {
                        switch (this.compressionType) {
                            case Const_1.Compression.NONE:
                                this.contents = contents;
                                break;
                            case Const_1.Compression.GZ:
                                try {
                                    this.contents = Utils_1.fromUint8Array(pako_1.inflateRaw(Utils_1.toUint8Array(contents)));
                                }
                                catch (error) {
                                    throw Error('Zlib error: ' + error);
                                }
                                break;
                            default:
                                throw Error('Unsupported compression type detected!');
                        }
                    }
                    else {
                        this.contents = contents;
                    }
                    return this;
                };
                /**
                 * Get file compressed contents
                 * @returns {string}
                 */
                File.prototype.getCompressedContents = function () {
                    switch (this.compressionType) {
                        case Const_1.Compression.GZ:
                            try {
                                return Utils_1.fromUint8Array(pako_1.deflateRaw(Utils_1.toUint8Array(this.contents)));
                            }
                            catch (error) {
                                throw Error('Zlib error: ' + error);
                            }
                        default:
                            return this.contents;
                    }
                };
                /**
                 * Get file size
                 * @returns {number}
                 */
                File.prototype.getSize = function () {
                    return this.getContents().length;
                };
                /**
                 * Get file compressed size
                 * @returns {number}
                 */
                File.prototype.getComressedSize = function () {
                    return this.getCompressedContents().length;
                };
                /**
                 * Get file compression type
                 * @returns {number}
                 */
                File.prototype.getCompressionType = function () {
                    return this.compressionType;
                };
                /**
                 * Set compression type
                 * @param {number} type
                 */
                File.prototype.setCompressionType = function (type) {
                    if (Const_1.default.SUPPORTED_COMPRESSION.indexOf(type) == -1) {
                        throw Error('(' + type + ') compression type is not supported!');
                    }
                    this.compressionType = type;
                    return this;
                };
                /**
                 * Get file permission
                 * @returns {number}
                 */
                File.prototype.getPermission = function () {
                    return this.permission;
                };
                /**
                 * Set file permission
                 * @param {number} perm
                 */
                File.prototype.setPermission = function (perm) {
                    if (perm > 4095 || perm < 0) {
                        throw Error('Permission number is too ' + (perm < 0 ? 'small' : 'large') + '!');
                    }
                    this.permission = perm;
                    return this;
                };
                /**
                 * Get phar flags
                 * @returns {number}
                 */
                File.prototype.getPharFlags = function () {
                    return (this.permission | this.compressionType);
                };
                /**
                 * Get file timestamp
                 * @returns {number}
                 */
                File.prototype.getTimestamp = function () {
                    return this.timestamp;
                };
                /**
                 * Set file timestamp
                 * @param {number} time
                 */
                File.prototype.setTimestamp = function (time) {
                    if (time < 0) {
                        time = Date.now() / 1000 | 0;
                    }
                    this.timestamp = time;
                    return this;
                };
                /**
                 * Get file metadata
                 * @returns {string}
                 */
                File.prototype.getMetadata = function () {
                    return this.metadata;
                };
                /**
                 * Set file metadata
                 * @param {string} metadata
                 */
                File.prototype.setMetadata = function (metadata) {
                    this.metadata = metadata;
                    return this;
                };
                return File;
            }());
            exports_1("default", File);
        }
    };
});
