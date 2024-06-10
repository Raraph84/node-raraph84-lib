const EventEmitter = require("events");
const Http = require("http");
const Request = require("./Request");
const { unescape } = require("querystring");

const findUpgradeHandler = (upgradeHandlers, url) => {

    url = unescape(url.split("?").shift());
    if (url.endsWith("/") && url !== "/") url = url.slice(0, url.length - 1);

    return upgradeHandlers.find((handler) => handler.path.toLowerCase() === url.toLowerCase());
};

module.exports = class HttpServer extends EventEmitter {

    /** @type {import("http").Server} */
    server = null;
    #upgradeHandlers = [];

    constructor() {

        super();

        this.server = Http.createServer();

        this.server.on("request", (req, res) => {

            let body = Buffer.alloc(0);
            req.on("data", (chunk) => body = Buffer.concat([body, chunk]));

            req.on("end", () => {

                const handler = findUpgradeHandler(this.#upgradeHandlers, req.url);
                if (handler) {
                    res.writeHead(426, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "Upgrade required", code: 426 }));
                    return;
                }

                this.emit("rawRequest", req, res, body.toString());
                this.emit("request", new Request(req, res, body));
            });
        });

        this.server.on("upgrade", (req, socket, head) => {

            const handler = findUpgradeHandler(this.#upgradeHandlers, req.url);
            if (!handler) {
                socket.end("HTTP/1.1 404 Not found\r\n\r\n");
                return;
            }

            handler.server.server.handleUpgrade(req, socket, head, (ws) => {
                handler.server.server.emit("connection", ws, req);
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
     * @param {string} path 
     * @param {import("./WebSocketServer")} server 
     */
    handleUpgrade(path, server) {
        server.listen({ noServer: true });
        this.#upgradeHandlers.push({ path, server });
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
