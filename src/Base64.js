module.exports = class Base64 {

    encode(text) {
        return Buffer.from(text).toString("base64");
    }

    decode(text) {
        return Buffer.from(text, "base64").toString("utf-8");
    }
}