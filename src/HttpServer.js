const EventEmitter = require("events");
const Request = require("./Request");

module.exports = class HttpServer extends EventEmitter {

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
}