module.exports = class StartTasksManager {

    /** @type {Object[]} */
    #tasks = [];

    /**
     * @param {Function} run 
     * @param {Function} terminate 
     */
    addTask(run, terminate) {
        this.#tasks.push({ run, terminate });
    }

    run() {

        const terminateTask = (task) => {

            task.terminate(() => {
                const nextTask = this.#tasks[this.#tasks.indexOf(task) - 1];
                if (nextTask) terminateTask(nextTask);
            });
        }

        const runTask = (task) => {

            task.run(() => {
                const nextTask = this.#tasks[this.#tasks.indexOf(task) + 1];
                if (nextTask) runTask(nextTask);
            }, () => {
                const nextTask = this.#tasks[this.#tasks.indexOf(task) - 1];
                if (nextTask) terminateTask(nextTask);
            });
        }

        const nextTask = this.#tasks[0];
        if (nextTask) runTask(nextTask);
    }
}
