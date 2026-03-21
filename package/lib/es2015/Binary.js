/**
 * Binary utils
 * @class Binary
 */
export default class Binary {
    /**
     * Reads little-endian 32-bit number
     * @property {string} buffer
     * @returns {number}
     */
    static readLInt(buffer) {
        let num = 0;
        for (let i = 0; i < 4; i++) {
            num |= buffer.charCodeAt(i) << (8 * i);
        }
        return num >>> 0;
    }
    /**
     * Writes little-endian 32-bit number
     * @property {number} number
     * @returns {string}
     */
    static writeLInt(number) {
        let buffer = '';
        for (var i = 0; i < 4; i++) {
            buffer += String.fromCharCode((number >> (8 * i)) & 0xff);
        }
        return buffer;
    }
    /**
     * Reads little-endian 16-bit number
     * @property {string} buffer
     * @returns {number}
     */
    static readLShort(buffer) {
        let num = 0;
        for (var i = 0; i < 2; i++) {
            num |= buffer.charCodeAt(i) << (8 * i);
        }
        return num;
    }
    /**
     * Writes little-endian 16-bit number
     * @property {number} number
     * @returns {string}
     */
    static writeLShort(number) {
        let buffer = '';
        for (var i = 0; i < 2; i++) {
            buffer += String.fromCharCode((number >> (8 * i)) & 0xff);
        }
        return buffer;
    }
}
