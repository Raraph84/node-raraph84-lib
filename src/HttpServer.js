const EventEmitter = require("events");
const Http = require("http");
const Request = require("./Request");

module.exports = class HttpServer extends EventEmitter {

    /** @type {Http.Server} */
    #server = null;

    constructor() {

        super();

        this.#server = Http.createServer((req, res) => {

            let data = "";
            req.on("data", (chunk) => data += chunk);

            req.on("end", () => {

                this.emit("rawRequest", req, res, data);
                this.emit("request", new Request(req, res, data));
            });
        });
    }

    /**
     * @param {Number} port 
     * @returns {Promise} 
     */
    listen(port) {
        return new Promise((resolve, reject) => {
            this.#server.listen(port, () => {
                resolve();
                this.emit("listening");
            });
        });
    }
}