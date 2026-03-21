System.register([], function (exports_1, context_1) {
    "use strict";
    var Binary;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            /**
             * Binary utils
             * @class Binary
             */
            Binary = /** @class */ (function () {
                function Binary() {
                }
                /**
                 * Reads little-endian 32-bit number
                 * @property {string} buffer
                 * @returns {number}
                 */
                Binary.readLInt = function (buffer) {
                    var num = 0;
                    for (var i = 0; i < 4; i++) {
                        num |= buffer.charCodeAt(i) << (8 * i);
                    }
                    return num >>> 0;
                };
                /**
                 * Writes little-endian 32-bit number
                 * @property {number} number
                 * @returns {string}
                 */
                Binary.writeLInt = function (number) {
                    var buffer = '';
                    for (var i = 0; i < 4; i++) {
                        buffer += String.fromCharCode((number >> (8 * i)) & 0xff);
                    }
                    return buffer;
                };
                /**
                 * Reads little-endian 16-bit number
                 * @property {string} buffer
                 * @returns {number}
                 */
                Binary.readLShort = function (buffer) {
                    var num = 0;
                    for (var i = 0; i < 2; i++) {
                        num |= buffer.charCodeAt(i) << (8 * i);
                    }
                    return num;
                };
                /**
                 * Writes little-endian 16-bit number
                 * @property {number} number
                 * @returns {string}
                 */
                Binary.writeLShort = function (number) {
                    var buffer = '';
                    for (var i = 0; i < 2; i++) {
                        buffer += String.fromCharCode((number >> (8 * i)) & 0xff);
                    }
                    return buffer;
                };
                return Binary;
            }());
            exports_1("default", Binary);
        }
    };
});
