export var HttpServer: {
    new (): import("./HttpServer");
};
export var Request: {
    new (req: IncomingMessage, res: ServerResponse, data: string): import("./Request");
};
export var Docker: {
    new (): import("./Docker");
};
export var formatDuration: (time: number) => string;
export var filterEndpointsByPath: (endpoints: import("./otherUtils").Endpoint[], request: import("./Request")) => import("./otherUtils").Endpoint[];
export var addDashesToUuid: (uuid: string) => string;
export var fetchAllUsers: (reaction: MessageReaction) => Promise<User[]>;
export var query: (database: any, sql: string, args?: string[]) => Promise<any>;
//# sourceMappingURL=index.d.ts.map