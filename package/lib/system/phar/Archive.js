System.register(["./Const", "./File", "../Binary", "../BinaryBuffer", "../Utils", "jshashes"], function (exports_1, context_1) {
    "use strict";
    var Const_1, File_1, Binary_1, BinaryBuffer_1, Utils_1, Hashes, Archive;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Const_1_1) {
                Const_1 = Const_1_1;
            },
            function (File_1_1) {
                File_1 = File_1_1;
            },
            function (Binary_1_1) {
                Binary_1 = Binary_1_1;
            },
            function (BinaryBuffer_1_1) {
                BinaryBuffer_1 = BinaryBuffer_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (Hashes_1) {
                Hashes = Hashes_1;
            }
        ],
        execute: function () {
            /**
             * Phar class
             * @class Phar
             */
            Archive = /** @class */ (function () {
                /**
                 * Phar
                 * @constructor
                 * @param {ArhiveOptions} options phar options
                 */
                function Archive(options) {
                    if (options === void 0) { options = {}; }
                    this.alias = options.alias || '';
                    this.setStub(options.stub || "<?php " + Const_1.default.STUB_END);
                    this.setSignatureType(options.signatureType || Const_1.Signature.SHA1);
                    this.metadata = options.metadata || '';
                    this.setFiles(options.files || []);
                    this.flags = options.flags || 0x10000;
                    this.manifestApi = options.manifestApi || 17;
                }
                /**
                 * Get stub
                 * @returns {string}
                 */
                Archive.prototype.getStub = function () {
                    return this.stub;
                };
                /**
                 * Set stub
                 * @param {string} stub
                 */
                Archive.prototype.setStub = function (stub) {
                    var pos = stub.toLowerCase().indexOf('__halt_compiler();');
                    if (pos == -1) {
                        throw Error('Stub is invalid!');
                    }
                    this.stub = stub.substring(0, pos) + Const_1.default.STUB_END;
                    return this;
                };
                /**
                 * Get alias
                 * @returns {string}
                 */
                Archive.prototype.getAlias = function () {
                    return this.alias;
                };
                /**
                 * Set alias
                 * @param {string} alias
                 */
                Archive.prototype.setAlias = function (alias) {
                    this.alias = alias;
                    return this;
                };
                /**
                 * Get signature type
                 * @returns {number}
                 */
                Archive.prototype.getSignatureType = function () {
                    return this.signatureType;
                };
                /**
                 * Set signature type
                 * @param {number} type
                 */
                Archive.prototype.setSignatureType = function (type) {
                    if (type != Const_1.Signature.MD5 && type != Const_1.Signature.SHA1 && type != Const_1.Signature.SHA256 && type != Const_1.Signature.SHA512) {
                        throw Error('Unknown signature type given!');
                    }
                    this.signatureType = type;
                    return this;
                };
                /**
                 * Get metadata
                 * @returns {string}
                 */
                Archive.prototype.getMetadata = function () {
                    return this.metadata;
                };
                /**
                 * Set metadata
                 * @param {string} meta
                 */
                Archive.prototype.setMetadata = function (meta) {
                    this.metadata = meta;
                    return this;
                };
                /**
                 * Add file
                 * @param {File} file
                 */
                Archive.prototype.addFile = function (file) {
                    if (file instanceof File_1.default) {
                        this.files.push(file);
                    }
                    return this;
                };
                /**
                 * Get file
                 * @param {string} name
                 * @returns {File?}
                 */
                Archive.prototype.getFile = function (name) {
                    return this.files.find(function (file) { return file.getName() == name; });
                };
                /**
                 * Remove file
                 * @param {string} name
                 */
                Archive.prototype.removeFile = function (name) {
                    this.files = this.files.filter(function (file) { return file.getName() != name; });
                    return this;
                };
                /**
                 * Get all files
                 * @returns {File[]}
                 */
                Archive.prototype.getFiles = function () {
                    return this.files.map(function (file) { return file; }); // Copy array
                };
                /**
                 * Set all files
                 * @param {File[]} files
                 */
                Archive.prototype.setFiles = function (files) {
                    var _this = this;
                    this.files = [];
                    files.forEach(function (file) { return _this.addFile(file); });
                    return this;
                };
                /**
                 * Get files count
                 * @returns {number}
                 */
                Archive.prototype.getFilesCount = function () {
                    return this.files.length;
                };
                /**
                 * Get phar flags
                 * @returns {number}
                 */
                Archive.prototype.getFlags = function () {
                    return this.flags;
                };
                /**
                 * Set phar flags
                 * @param {number} flags
                 */
                Archive.prototype.setFlags = function (flags) {
                    this.flags = flags;
                    return this;
                };
                /**
                 * Get manifest API version
                 * @returns {number}
                 */
                Archive.prototype.getManifestApi = function () {
                    return this.manifestApi;
                };
                /**
                 * Set manifest API version
                 * @param {number} api
                 */
                Archive.prototype.setManifestApi = function (api) {
                    this.manifestApi = api;
                    return this;
                };
                /**
                 * Load phar from contents
                 * @param {(string|Uint8Array)} buffer phar contents
                 */
                Archive.prototype.loadPharData = function (buffer) {
                    if (buffer instanceof Uint8Array) {
                        buffer = Utils_1.fromUint8Array(buffer);
                    }
                    var pos = buffer.length - 4;
                    if (buffer.substring(pos) != Const_1.default.END_MAGIC) {
                        throw new Error('Phar is corrupted! (magic corrupt)');
                    }
                    pos -= 4;
                    var signatureType = Binary_1.default.readLInt(buffer.substring(pos, pos + 4));
                    var hasher, hashLength;
                    switch (signatureType) {
                        case Const_1.Signature.MD5:
                            hashLength = 16;
                            hasher = new Hashes.MD5({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA1:
                            hashLength = 20;
                            hasher = new Hashes.SHA1({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA256:
                            hashLength = 32;
                            hasher = new Hashes.SHA256({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA512:
                            hashLength = 64;
                            hasher = new Hashes.SHA512({
                                utf8: false
                            });
                            break;
                        default:
                            throw Error('Unknown signature type detected!');
                    }
                    var hash = buffer.substring(pos - hashLength, pos);
                    buffer = buffer.substring(0, pos - hashLength);
                    if (hasher.raw(buffer) != hash) {
                        throw Error('Phar has a broken signature!');
                    }
                    var stubLength = buffer.indexOf(Const_1.default.STUB_END);
                    if (stubLength == -1) {
                        throw Error('Stub not found!');
                    }
                    stubLength += Const_1.default.STUB_END.length;
                    var binaryBuffer = new BinaryBuffer_1.default(buffer);
                    this.stub = binaryBuffer.get(stubLength);
                    var manifestBuffer = new BinaryBuffer_1.default(binaryBuffer.getString());
                    var filesCount = manifestBuffer.getLInt();
                    this.manifestApi = manifestBuffer.getLShort();
                    this.flags = manifestBuffer.getLInt();
                    this.alias = manifestBuffer.getString();
                    this.metadata = manifestBuffer.getString();
                    this.files = [];
                    for (var i = 0; i < filesCount; i++) {
                        var options = {};
                        var filename = manifestBuffer.getString();
                        manifestBuffer.offset += 4; // uncompressed file size
                        options.timestamp = manifestBuffer.getLInt();
                        var size = manifestBuffer.getLInt(), readedCrc32 = manifestBuffer.getLInt(), flags = manifestBuffer.getLInt();
                        options.permission = flags & 0xfff;
                        options.compressionType = flags & 0xf000;
                        options.metadata = manifestBuffer.getString();
                        options.isCompressed = true;
                        var file = new File_1.default(filename, binaryBuffer.get(size), options);
                        if (readedCrc32 != Utils_1.crc32(file.getContents())) {
                            throw Error('Phar is corrupted! (file corrupt)');
                        }
                        this.files.push(file);
                    }
                    return this;
                };
                /**
                 * Save phar file contents
                 * @param {boolean} asU8A save result as Uint8Array (Default true)
                 * @returns {string|Uint8Array} phar contents
                 */
                Archive.prototype.savePharData = function (asU8A) {
                    if (asU8A === void 0) { asU8A = true; }
                    if (!this.getFilesCount()) {
                        throw Error('Phar must have at least one file!');
                    }
                    var buffer = new BinaryBuffer_1.default(), manifestBuffer = new BinaryBuffer_1.default();
                    buffer.put(this.stub);
                    manifestBuffer
                        .putLInt(this.getFilesCount())
                        .putLShort(this.manifestApi)
                        .putLInt(this.flags)
                        .putString(this.alias)
                        .putString(this.metadata);
                    var allContents = '';
                    this.files.forEach(function (file) {
                        var contents = file.getCompressedContents();
                        manifestBuffer
                            .putString(file.getName())
                            .putLInt(file.getSize())
                            .putLInt(file.getTimestamp())
                            .putLInt(contents.length)
                            .putLInt(Utils_1.crc32(file.getContents()))
                            .putLInt(file.getPharFlags())
                            .putString(file.getMetadata());
                        allContents += contents;
                    });
                    buffer
                        .putString(manifestBuffer.getBuffer())
                        .put(allContents);
                    var hasher;
                    switch (this.signatureType) {
                        case Const_1.Signature.MD5:
                            hasher = new Hashes.MD5({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA1:
                            hasher = new Hashes.SHA1({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA256:
                            hasher = new Hashes.SHA256({
                                utf8: false
                            });
                            break;
                        case Const_1.Signature.SHA512:
                            hasher = new Hashes.SHA512({
                                utf8: false
                            });
                            break;
                        default:
                            throw Error('Unknown signature type detected!');
                    }
                    var hash = hasher.raw(buffer.getBuffer());
                    buffer
                        .put(hash)
                        .putLInt(this.signatureType)
                        .put(Const_1.default.END_MAGIC);
                    return asU8A ? Utils_1.toUint8Array(buffer.getBuffer()) : buffer.getBuffer();
                };
                return Archive;
            }());
            exports_1("default", Archive);
        }
    };
});
