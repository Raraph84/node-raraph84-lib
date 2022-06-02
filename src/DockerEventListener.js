const EventEmitter = require("events");
const { PassThrough } = require("stream");
const Docker = require("dockerode");

module.exports = class DockerEventListener extends EventEmitter {

    /** @type {import("dockerode")} */
    #docker = null;
    #stream = null;

    /**
     * @param {import("dockerode")} docker 
     */
    constructor(docker = new Docker()) {

        super();

        this.#docker = docker;

        this.closed = false;
    }

    listen() {
        this.#docker.getEvents((error, stream) => {

            if (error) {
                this.emit("error", error);
                setTimeout(() => this.listen(), 500);
                return;
            }

            this.#stream = stream;

            const parser = new PassThrough();
            parser.on("data", (data) => {

                let event;
                try {
                    event = JSON.parse(data.toString("utf8"));
                } catch {
                    return;
                }

                this.emit("rawEvent", event);
            });

            this.#stream.pipe(parser);
            this.#stream.on("close", () => {
                if (!this.closed)
                    setTimeout(() => this.listen(), 500);
            });
        });
    }

    close() {

        this.closed = true;
        this.#stream.destroy();
    }
}