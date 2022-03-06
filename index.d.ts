import EventEmitter from "events";
import Http from "http";
import Request from "./src/Request";

export interface HttpServerEvents {
    listening: [];
    rawRequest: [req: Http.IncomingMessage, res: Http.ServerResponse, data: string];
    request: [request: Request];
}

export class HttpServer extends EventEmitter {

    public constructor();

    public on<K extends keyof HttpServerEvents>(
        event: K,
        listener: (...args: HttpServerEvents[K]) => Awaitable<void>,
    ): this;
    public on<S extends string | symbol>(
        event: Exclude<S, keyof HttpServerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public once<K extends keyof HttpServerEvents>(
        event: K,
        listener: (...args: HttpServerEvents[K]) => Awaitable<void>,
    ): this;
    public once<S extends string | symbol>(
        event: Exclude<S, keyof HttpServerEvents>,
        listener: (...args: any[]) => Awaitable<void>,
    ): this;

    public listen<>(port: number): Promise<void>;
}