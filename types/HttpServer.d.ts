export = HttpServer;
declare class HttpServer {
    /**
     * @param {Number} port
     * @returns {Promise}
     */
    listen(port: number): Promise<any>;
    #private;
}
