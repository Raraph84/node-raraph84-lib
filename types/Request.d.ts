export = Request;
declare class Request {
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {String} data
     */
    constructor(req: any, res: any, data: string);
    data: string;
    method: any;
    headers: any;
    ip: any;
    url: any;
    searchParams: URLSearchParams;
    /**
     * @param {String} name
     * @param {String} value
     */
    setHeader(name: string, value: string): void;
    /**
     * @param {Number} code
     * @param {Object|String} data
     */
    end(code: number, data: any | string): void;
    #private;
}
