export = EventListener;
declare class EventListener extends EventEmitter {
    constructor();
    closed: boolean;
    listen(): void;
    close(): void;
    #private;
}
import EventEmitter = require("events");
//# sourceMappingURL=Docker.d.ts.map