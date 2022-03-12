export var HttpServer: {
    new (): import("./HttpServer");
};
export var Request: {
    new (req: any, res: any, data: string): import("./Request");
};
export var Docker: {
    new (): import("./Docker");
};
export var formatDuration: (time: number) => string;
export var filterEndpointsByPath: (endpoints: import("./otherUtils").Endpoint[], request: import("./Request")) => import("./otherUtils").Endpoint[];
export var addDashesToUuid: (uuid: string) => string;
export var fetchAllUsers: (reaction: any) => Promise<any[]>;
export var query: (database: any, sql: string, args?: string[]) => Promise<any>;
export var randomString: (length: number) => string;
