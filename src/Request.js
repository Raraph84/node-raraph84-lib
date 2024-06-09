const { unescape } = require("querystring");
const { URLSearchParams } = require("url");

module.exports = class Request {

    /**
     * @param {import("http").IncomingMessage} req 
     * @param {import("http").ServerResponse} res 
     * @param {Buffer} body 
     */
    constructor(req, res, body) {

        this.res = res;
        this.req = req;
        this.rawBody = body;
        this.body = body.toString();
        /** @deprecated */
        this.data = body.toString();
        this.jsonBody = null;
        try {
            this.jsonBody = JSON.parse(this.body);
        } catch (error) {
        }
        this.method = req.method.toUpperCase();
        this.headers = req.headers;
        this.ip = req.headers["x-forwarded-for"]?.split(", ").pop() || (req.socket.remoteAddress.startsWith("::ffff:") ? req.socket.remoteAddress.slice(7) : req.socket.remoteAddress);
        this.urlParams = {};
        this.date = Date.now();

        const urlSplitted = req.url.split("?");
        this.url = unescape(urlSplitted.shift());
        this.searchParams = new URLSearchParams(urlSplitted.join("?"));
        if (this.url.endsWith("/") && this.url !== "/") this.url = this.url.slice(0, this.url.length - 1);
    }

    /**
     * @param {string} name 
     * @param {string} value 
     */
    setHeader(name, value) {
        this.res.setHeader(name, value);
    }

    /**
     * @param {number} code 
     * @param {object|string} body 
     */
    end(code, body) {

        if (typeof body === "object" || typeof body === "string")
            this.res.setHeader("Content-Type", "application/json");

        this.res.writeHead(code);

        if (typeof body === "object") this.res.end(JSON.stringify({ ...body, code }));
        else if (typeof body === "string") this.res.end(JSON.stringify({ message: body, code }));
        else this.res.end();
    }

    /**
     * @param {buffer} buffer 
     * @param {string} mime 
     */
    endFile(buffer, mime) {

        this.res.setHeader("Content-Type", mime);
        this.res.writeHead(200);
        this.res.end(buffer);
    }
}
