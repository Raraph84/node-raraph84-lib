export = Base64;
declare class Base64 {
    /**
     * @param {String} text
     * @returns {String}
     */
    static encode(text: string): string;
    /**
     * @param {String} text
     * @returns {String}
     */
    static decode(text: string): string;
}
