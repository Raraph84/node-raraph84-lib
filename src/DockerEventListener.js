const EventEmitter = require("events");
const { PassThrough } = require("stream");
const Docker = require("dockerode");

module.exports = class DockerEventListener extends EventEmitter {

    #stream = null;

    /**
     * @param {import("dockerode")} docker 
     */
    constructor(docker = new Docker()) {

        super();

        this.docker = docker;
        this.closed = false;
    }

    listen() {
        this.emit("connecting");
        this.docker.getEvents((error, stream) => {

            if (error) {
                this.emit("error", error);
                setTimeout(() => { if (!this.closed) this.listen(); }, 500);
                return;
            }

            if (this.closed) {
                stream.destroy();
                return;
            }

            this.#stream = stream;

            const parser = new PassThrough();
            parser.on("data", (data) => {

                let event;
                try {
                    event = JSON.parse(data.toString());
                } catch {
                    return;
                }

                this.emit("rawEvent", event);
            });

            this.#stream.on("close", () => {
                this.emit("disconnected");
                parser.end();
                setTimeout(() => { if (!this.closed) this.listen(); }, 500);
            });

            this.#stream.pipe(parser);
            this.emit("connected");
        });
    }

    close() {
        this.closed = true;
        if (this.#stream) this.#stream.destroy();
    }
}
