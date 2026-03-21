/**
 * Binary buffer
 * @class BinaryBuffer
 */
export default class BinaryBuffer {
    /**
     * @type {string}
     */
    private buffer;
    /**
     * @type {number}
     */
    offset: number;
    /**
     * Binary buffer
     * @constructor
     * @property {string} buffer - buffer data
     */
    constructor(buffer?: string);
    /**
     * @returns {string}
     */
    getBuffer(): string;
    /**
     * @param {number} length
     */
    get(length: number): string;
    /**
     * @param {string} data
     */
    put(data: string): this;
    /**
     * @returns {number}
     */
    getLInt(): number;
    /**
     * @param {number} number
     */
    putLInt(number: number): this;
    /**
     * @returns {number}
     */
    getLShort(): number;
    /**
     * @param {number} number
     */
    putLShort(number: number): this;
    /**
     * @returns {string}
     */
    getString(): string;
    /**
     * @param {string} data
     */
    putString(data: string): this;
}
//# sourceMappingURL=BinaryBuffer.d.ts.map