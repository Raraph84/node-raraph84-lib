module.exports = class Request {

    /**
     * @param {import("http").IncomingMessage} req 
     * @param {import("http").ServerResponse} res 
     * @param {String} body 
     */
    constructor(req, res, body) {

        this.res = res;
        this.req = req;
        this.body = body;
        this.data = body; // Deprecated
        this.method = req.method.toUpperCase();
        this.headers = req.headers;
        this.ip = req.headers["x-forwarded-for"] || (req.socket.remoteAddress.startsWith("::ffff:") ? req.socket.remoteAddress.slice(7) : req.socket.remoteAddress);
        this.urlParams = {};
        this.date = new Date();

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
     * @param {Object|String} body 
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
     * @param {Buffer} buffer 
     * @param {String} mime 
     */
    endFile(buffer, mime) {

        this.res.setHeader("Content-Type", mime);
        this.res.writeHead(200);
        this.res.end(buffer);
    }
}
