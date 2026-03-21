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
    static readLInt(buffer: string): number;
    /**
     * Writes little-endian 32-bit number
     * @property {number} number
     * @returns {string}
     */
    static writeLInt(number: number): string;
    /**
     * Reads little-endian 16-bit number
     * @property {string} buffer
     * @returns {number}
     */
    static readLShort(buffer: string): number;
    /**
     * Writes little-endian 16-bit number
     * @property {number} number
     * @returns {string}
     */
    static writeLShort(number: number): string;
}
//# sourceMappingURL=Binary.d.ts.map