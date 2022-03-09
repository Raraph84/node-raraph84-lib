/// <reference types="node" />
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
    method: string;
    ip: string | string[];
    url: string;
    searchParams: URLSearchParams;
    /**
     * @param {Number} code
     * @param {Object|String} data
     */
    end(code: number, data: any | string): void;
}
import { IncomingMessage } from "http";
import { ServerResponse } from "http";
//# sourceMappingURL=Request.d.ts.map