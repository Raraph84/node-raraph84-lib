const EventEmitter = require("events");
const { PassThrough } = require("stream");

module.exports = class DockerLogsListener extends EventEmitter {

    #stream = null;

    /**
     * @param {import("dockerode").Container} container 
     */
    constructor(container) {

        super();

        this.container = container;
        this.closed = false;
    }

    listen(from) {
        this.emit("connecting");
        this.container.inspect((error, infos) => {

            if (error) {
                this.emit("error", error);
                setTimeout(() => { if (!this.closed) this.listen(from); }, 500);
                return;
            }

            if (typeof from === "undefined")
                from = new Date(infos.State.StartedAt).getDate();

            this.container.logs({ follow: true, stdout: true, stderr: true, since: Math.floor(from / 1000), timestamps: true }, (error, stream) => {

                if (error) {
                    this.emit("error", error);
                    setTimeout(() => { if (!this.closed) this.listen(from); }, 500);
                    return;
                }

                this.#stream = stream;

                const parser = new PassThrough();
                parser.on("data", (data) => {
                    const date = new Date(data.toString().split(" ").shift());
                    const line = data.toString().split(" ").slice(1).join(" ").replace(/\n|\r/g, "");
                    if (date.getTime() < from) return;
                    this.emit("output", line, date);
                });

                this.#stream.on("close", () => {
                    this.emit("disconnected");
                    parser.end();
                    setTimeout(() => { if (!this.closed) this.listen(); }, 500);
                });

                if (infos.Config.Tty)
                    this.#stream.pipe(parser);
                else
                    this.container.modem.demuxStream(this.#stream, parser, parser);
                this.emit("connected");
            });
        });
    }

    close() {
        this.closed = true;
        this.#stream.destroy();
    }
}
