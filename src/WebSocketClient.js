module.exports = class WebSocketClient {

    /**
     * @param {import("ws").WebSocket} socket 
     * @param {*} request 
     */
    constructor(socket, request) {
        this.socket = socket;
        this.ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress.slice(7) || "127.0.0.1";
        this.infos = {};
    }

    emitEvent(event, data = {}) {
        this.socket.send(JSON.stringify({ event, ...data }));
    }

    close(reason) {
        this.socket.close(1000, reason);
    }
}
