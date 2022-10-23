module.exports = class TaskManager {

    /** @type {Task[]} */
    #tasks = [];

    /**
     * @param {loadCallback} load 
     * @param {unloadCallback} unload 
     */
    addTask(load, unload) {
        this.#tasks.push({ load, unload });
    }

    run() {

        /**
         * @param {Number} lastTaskIndex 
         */
        const unloadNextTask = (lastTaskIndex) => {

            const nextTask = this.#tasks[lastTaskIndex - 1];
            if (!nextTask) return;

            try {
                nextTask.unload(() => {
                    unloadNextTask(this.#tasks.indexOf(nextTask));
                });
            } catch (error) {
                console.trace(error);
            }
        }

        /**
         * @param {Number} lastTaskIndex 
         */
        const loadNextTask = (lastTaskIndex) => {

            const nextTask = this.#tasks[lastTaskIndex + 1];
            if (!nextTask) return;

            try {
                nextTask.load(() => {
                    loadNextTask(this.#tasks.indexOf(nextTask));
                }, () => {
                    unloadNextTask(this.#tasks.indexOf(nextTask));
                });
            } catch (error) {
                console.trace(error);
                unloadNextTask(this.#tasks.indexOf(nextTask));
            }
        }

        loadNextTask(-1);
    }
}

/**
 * @callback loadCallback 
 * @param {() => void} resolve 
 * @param {() => void} reject 
 */

/**
 * @callback unloadCallback 
 * @param {() => void} resolve 
 */

/**
 * @typedef {Object} Task 
 * @property {loadCallback} load 
 * @property {unloadCallback} unload 
 */
