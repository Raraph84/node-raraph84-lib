const EventEmitter = require("events");
const Http = require("http");
const Request = require("./Request");

module.exports = class HttpServer extends EventEmitter {

    /** @type {import("http").Server} */
    server = null;

    constructor() {

        super();

        this.server = Http.createServer((req, res) => {

            let body = Buffer.alloc(0);
            req.on("data", (chunk) => body = Buffer.concat([body, chunk]));

            req.on("end", () => {

                this.emit("rawRequest", req, res, body.toString());
                this.emit("request", new Request(req, res, body));
            });
        });
    }

    /**
     * @param {number} port 
     * @returns {Promise} 
     */
    listen(port) {
        return new Promise((resolve) => {
            this.server.listen(port, () => resolve());
        });
    }

    /**
     * @returns {Promise} 
     */
    close() {
        return new Promise((resolve) => {
            this.server.close(() => resolve());
        });
    }
}
