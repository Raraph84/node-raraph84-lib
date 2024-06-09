module.exports = class WebSocketClient {

    /**
     * @param {import("ws").WebSocket} socket 
     * @param {import("http").IncomingMessage} request 
     */
    constructor(socket, request) {
        this.socket = socket;
        this.ip = request.headers["x-forwarded-for"]?.split(", ").pop() || (request.socket.remoteAddress.startsWith("::ffff:") ? request.socket.remoteAddress.slice(7) : request.socket.remoteAddress);
        this.infos = {}; // For storing details about the connection
    }

    emitEvent(event, data = {}) {
        this.socket.send(JSON.stringify({ event, ...data }));
    }

    close(reason) {
        this.socket.close(1000, reason);
    }
}
