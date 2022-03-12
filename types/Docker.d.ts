export = EventListener;
declare class EventListener {
    closed: boolean;
    listen(): void;
    close(): void;
    #private;
}
