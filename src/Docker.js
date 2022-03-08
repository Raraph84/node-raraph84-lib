const EventEmitter = require("events");
const Dockerode = require("dockerode");
const { PassThrough } = require("stream");

module.exports.EventListener = class EventListener extends EventEmitter {

    #docker = new Dockerode();
    #stream = null;

    constructor() {

        super();

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