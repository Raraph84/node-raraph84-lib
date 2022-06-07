module.exports = class WebSocketClient {

    /**
     * @param {import("ws").WebSocket} socket 
     * @param {*} request 
     */
    constructor(socket, request) {
        this.socket = socket;
        this.ip = request.socket.remoteAddress;
        this.infos = {};
    }

    emitEvent(event, data = {}) {
        this.socket.send(JSON.stringify({ ...data, event }));
    }

    close(reason) {
        this.socket.close(1000, reason);
    }
}
