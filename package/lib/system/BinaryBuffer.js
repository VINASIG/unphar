System.register(["./Binary"], function (exports_1, context_1) {
    "use strict";
    var Binary_1, BinaryBuffer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Binary_1_1) {
                Binary_1 = Binary_1_1;
            }
        ],
        execute: function () {
            /**
             * Binary buffer
             * @class BinaryBuffer
             */
            BinaryBuffer = /** @class */ (function () {
                /**
                 * Binary buffer
                 * @constructor
                 * @property {string} buffer - buffer data
                 */
                function BinaryBuffer(buffer) {
                    if (buffer === void 0) { buffer = ''; }
                    /**
                     * @type {number}
                     */
                    this.offset = 0;
                    this.buffer = buffer;
                    return this;
                }
                /**
                 * @returns {string}
                 */
                BinaryBuffer.prototype.getBuffer = function () {
                    return this.buffer;
                };
                /**
                 * @param {number} length
                 */
                BinaryBuffer.prototype.get = function (length) {
                    if (length < 0) {
                        length = Math.max(0, this.buffer.length - this.offset);
                    }
                    if (length == 0) {
                        return '';
                    }
                    if ((this.offset += length) > this.buffer.length) {
                        throw Error('Buffer is accessed out of bounds!');
                    }
                    return this.buffer.substring(this.offset - length, this.offset);
                };
                /**
                 * @param {string} data
                 */
                BinaryBuffer.prototype.put = function (data) {
                    this.buffer += data;
                    return this;
                };
                /**
                 * @returns {number}
                 */
                BinaryBuffer.prototype.getLInt = function () {
                    return Binary_1.default.readLInt(this.get(4));
                };
                /**
                 * @param {number} number
                 */
                BinaryBuffer.prototype.putLInt = function (number) {
                    this.put(Binary_1.default.writeLInt(number));
                    return this;
                };
                /**
                 * @returns {number}
                 */
                BinaryBuffer.prototype.getLShort = function () {
                    return Binary_1.default.readLShort(this.get(2));
                };
                /**
                 * @param {number} number
                 */
                BinaryBuffer.prototype.putLShort = function (number) {
                    this.put(Binary_1.default.writeLShort(number));
                    return this;
                };
                /**
                 * @returns {string}
                 */
                BinaryBuffer.prototype.getString = function () {
                    return this.get(this.getLInt());
                };
                /**
                 * @param {string} data
                 */
                BinaryBuffer.prototype.putString = function (data) {
                    this.putLInt(data.length);
                    this.put(data);
                    return this;
                };
                return BinaryBuffer;
            }());
            exports_1("default", BinaryBuffer);
        }
    };
});
