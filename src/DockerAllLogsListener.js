const EventEmitter = require("events");
const DockerEventListener = require("./DockerEventListener");
const DockerLogsListener = require("./DockerLogsListener");

module.exports = class DockerAllLogsListener extends EventEmitter {

    /** @type {import("./DockerEventListener")} */
    #eventListener = null;
    /** @type {import("./DockerLogsListener")[]} */
    #logsListeners = [];

    /**
     * @param {import("dockerode")} docker 
     */
    constructor(docker) {

        super();

        let Docker;
        try {
            Docker = require("dockerode");
        } catch (error) {
            throw new Error("Dockerode is not installed. Please install it by running 'npm install dockerode'");
        }

        this.docker = docker || new Docker();
        this.closed = false;

        this.#eventListener = new DockerEventListener(docker);
        this.#eventListener.on("rawEvent", (event) => {

            if (event.Type !== "container") return;

            const container = this.docker.getContainer(event.Actor.ID);

            if (event.Action === "start") {

                const logsListener = new DockerLogsListener(container);
                logsListener.on("output", (output, date) => this.emit("output", container, output, date));
                logsListener.listen();
                this.#logsListeners.push(logsListener);

            } else if (event.Action === "die") {

                this.#logsListeners.splice(this.#logsListeners.indexOf(this.#logsListeners.find((listener) => listener.container.id === container.id)), 1)[0].close();
            }
        });
    }

    listen(from) {

        this.#eventListener.listen();

        this.docker.listContainers().then((containers) => containers.map((container) => this.docker.getContainer(container.Id)).forEach((container) => {

            const logsListener = new DockerLogsListener(container);
            logsListener.on("output", (output, date) => this.emit("output", container, output, date));
            logsListener.listen(from);
            this.#logsListeners.push(logsListener);
        }));
    }

    close() {
        this.closed = true;
        this.#eventListener.close();
        this.#logsListeners.forEach((listener) => listener.close());
    }
}
