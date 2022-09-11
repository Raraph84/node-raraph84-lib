module.exports = class Request {

    /**
     * @param {import("http").IncomingMessage} req 
     * @param {import("http").ServerResponse} res 
     * @param {String} data 
     */
    constructor(req, res, data) {

        this.res = res;
        this.req = req;
        this.data = data;
        this.method = req.method.toUpperCase();
        this.headers = req.headers;
        this.ip = req.headers["x-forwarded-for"] || (req.socket.remoteAddress.startsWith("::ffff:") ? req.socket.remoteAddress.slice(7) : req.socket.remoteAddress);
        this.urlParams = {};

        const urlSplitted = decodeURI(req.url).split("?");
        this.url = urlSplitted.shift();
        this.searchParams = new URLSearchParams(urlSplitted.join("?"));
        if (this.url.endsWith("/") && this.url !== "/") this.url = this.url.slice(0, this.url.length - 1);
    }

    /**
     * @param {String} name 
     * @param {String} value 
     */
    setHeader(name, value) {
        this.res.setHeader(name, value);
    }

    /**
     * @param {Number} code 
     * @param {Object|String} data 
     */
    end(code, data) {

        if (typeof data === "object" || typeof data === "string")
            this.res.setHeader("Content-Type", "application/json");

        this.res.writeHead(code);

        if (typeof data === "object") this.res.end(JSON.stringify({ ...data, code }));
        else if (typeof data === "string") this.res.end(JSON.stringify({ message: data, code }));
        else this.res.end();
    }

    /**
     * @param {Buffer} buffer 
     * @param {String} mime 
     */
    endFile(buffer, mime) {

        this.res.setHeader("Content-Type", mime);
        this.res.writeHead(200);
        this.res.end(buffer);
    }
}
