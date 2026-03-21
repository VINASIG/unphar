import Binary from './Binary';
/**
 * Binary buffer
 * @class BinaryBuffer
 */
export default class BinaryBuffer {
    /**
     * Binary buffer
     * @constructor
     * @property {string} buffer - buffer data
     */
    constructor(buffer = '') {
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
    getBuffer() {
        return this.buffer;
    }
    /**
     * @param {number} length
     */
    get(length) {
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
    }
    /**
     * @param {string} data
     */
    put(data) {
        this.buffer += data;
        return this;
    }
    /**
     * @returns {number}
     */
    getLInt() {
        return Binary.readLInt(this.get(4));
    }
    /**
     * @param {number} number
     */
    putLInt(number) {
        this.put(Binary.writeLInt(number));
        return this;
    }
    /**
     * @returns {number}
     */
    getLShort() {
        return Binary.readLShort(this.get(2));
    }
    /**
     * @param {number} number
     */
    putLShort(number) {
        this.put(Binary.writeLShort(number));
        return this;
    }
    /**
     * @returns {string}
     */
    getString() {
        return this.get(this.getLInt());
    }
    /**
     * @param {string} data
     */
    putString(data) {
        this.putLInt(data.length);
        this.put(data);
        return this;
    }
}
