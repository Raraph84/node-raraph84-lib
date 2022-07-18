const EventEmitter = require("events");
const WebSocket = require("ws");
const WebSocketClient = require("./WebSocketClient");

module.exports = class WebSocketServer extends EventEmitter {

    /** @type {import("ws").Server} */
    #server = null;

    constructor() {

        super();

        /** @type {import("./WebSocketClient")[]} */
        this.clients = [];
    }

    /**
     * @param {Number} port 
     * @returns {Promise} 
     */
    listen(port) {
        return new Promise((resolve) => {

            this.#server = new WebSocket.Server({ port });
            this.#server.on("listening", () => resolve());
            this.#server.on("connection", (socket, request) => {

                const client = new WebSocketClient(socket, request);

                this.clients.push(client);
                this.emit("connection", client);

                socket.on("message", (data) => {

                    this.emit("rawMessage", client, data);

                    let message;
                    try {
                        message = JSON.parse(data);
                    } catch (error) {
                        client.close("Invalid JSON");
                        return;
                    }

                    const command = message.command;
                    delete message.command;

                    if (typeof command === "undefined") {
                        client.close("Missing command");
                        return;
                    }

                    if (typeof command !== "string") {
                        client.close("Command must be a string");
                        return;
                    }

                    this.emit("command", command, client, message);
                });

                socket.on("close", () => {
                    this.clients.splice(this.clients.indexOf(client), 1);
                    this.emit("close", client);
                });
            });
        });
    }

    /**
     * @returns {Promise} 
     */
    close() {
        return new Promise((resolve) => {
            this.#server.close(() => resolve());
        });
    }
}
