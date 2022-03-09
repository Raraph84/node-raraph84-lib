export = HttpServer;
declare class HttpServer extends EventEmitter {
    constructor();
    /**
     * @param {Number} port
     * @returns {Promise}
     */
    listen(port: number): Promise<any>;
    #private;
}
import EventEmitter = require("events");
//# sourceMappingURL=HttpServer.d.ts.map