module.exports = class Base64 {

    /**
     * @param {String} text 
     * @returns {String} 
     */
    static encode(text) {
        return Buffer.from(text).toString("base64");
    }

    /**
     * @param {String} text 
     * @returns {String} 
     */
    static decode(text) {
        return Buffer.from(text, "base64").toString("utf-8");
    }
}
