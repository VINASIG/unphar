System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
     * @param {string} string
     */
    function crc32(string) {
        var crcTable = (function () {
            var c;
            var crcTable = [];
            for (var n = 0; n < 256; n++) {
                c = n;
                for (var k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            return crcTable;
        })();
        var crc = 0 ^ (-1);
        for (var i = 0; i < string.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ string.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }
    exports_1("crc32", crc32);
    /**
     * Convert string to Uint8Array
     * @param {string} string
     * @returns {Uint8Array}
     */
    function toUint8Array(string) {
        var u8a = new Uint8Array(string.length), forEach = Array.prototype.forEach;
        forEach.call(string, function (value, index) {
            u8a[index] = string.charCodeAt(index);
        });
        return u8a;
    }
    exports_1("toUint8Array", toUint8Array);
    /**
     * Convert Uint8Array to string
     * @param {Uint8Array} u8a
     * @returns {string}
     */
    function fromUint8Array(u8a) {
        var string = '';
        u8a.forEach(function (value, index) {
            string += String.fromCharCode(u8a[index]);
        });
        return string;
    }
    exports_1("fromUint8Array", fromUint8Array);
    return {
        setters: [],
        execute: function () {
        }
    };
});
