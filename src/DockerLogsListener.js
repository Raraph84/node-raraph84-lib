const EventEmitter = require("events");
const { PassThrough } = require("stream");

module.exports = class DockerLogsListener extends EventEmitter {

    /** @type {import("dockerode").Container} */
    #container = null;
    #stream = null;

    /**
     * @param {import("dockerode").Container} container 
     */
    constructor(container) {

        super();

        this.#container = container;
        this.closed = false;
    }

    listen() {
        this.#container.logs({ follow: true, stdout: true, stderr: true, since: Math.round(Date.now() / 1000) }, (error, stream) => {

            if (error) {
                this.emit("error", error);
                setTimeout(() => { if (!this.closed) this.listen(); }, 500);
                return;
            }

            this.#stream = stream;

            const parser = new PassThrough();
            parser.on("data", (data) => {
                this.emit("output", data.toString());
            });

            this.#container.modem.demuxStream(this.#stream, parser, parser);
            this.#stream.on("close", () => {
                setTimeout(() => { if (!this.closed) this.listen(); }, 500);
            });
        });
    }

    close() {
        this.closed = true;
        this.#stream.destroy();
    }
}
