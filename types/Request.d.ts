export = Request;
declare class Request {
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {String} data
     */
    constructor(req: IncomingMessage, res: ServerResponse, data: string);
    req: IncomingMessage;
    res: ServerResponse;
    data: string;
    method: any;
    ip: any;
    url: any;
    searchParams: URLSearchParams;
    /**
     * @param {Number} code
     * @param {Object|String} data
     */
    end(code: number, data: any | string): void;
}
//# sourceMappingURL=Request.d.ts.map