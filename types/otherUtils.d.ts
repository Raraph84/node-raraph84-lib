export function formatDuration(time: number): string;
export function filterEndpointsByPath(endpoints: Endpoint[], request: Request): Endpoint[];
export function addDashesToUuid(uuid: string): string;
export function fetchAllUsers(reaction: MessageReaction): Promise<User[]>;
export function query(database: any, sql: string, args?: string[]): Promise<any>;
export type Endpoint = {
    infos: EndpointInfos;
    params: any;
    run: Function;
};
export type EndpointInfos = {
    path: string;
    method: string;
    requireAuth: boolean;
};
import Request = require("./Request");
//# sourceMappingURL=otherUtils.d.ts.map