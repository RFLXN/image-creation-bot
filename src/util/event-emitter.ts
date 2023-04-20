import { EventEmitter as NonTypeEmitter } from "events";

interface EventType {
    [eventName: string]: [...any];
}

type Listener = (...args: any[]) => void;

/**
 * wrapper class of "node/events.EventEmitter" for typing.
 */
class EventEmitter<E extends EventType> {
    private emitter: NonTypeEmitter;

    public constructor() {
        this.emitter = new NonTypeEmitter();
    }

    public on<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void) {
        this.emitter.on(eventName as string, listener as Listener);
        return this;
    }

    public once<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void) {
        this.emitter.once(eventName as string, listener as Listener);
        return this;
    }

    public off<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void) {
        this.emitter.off(eventName as string, listener as Listener);
        return this;
    }

    public emit<K extends keyof E>(eventName: K, ...args: E[K]) {
        return this.emitter.emit(eventName as string, ...args);
    }
}

export { EventEmitter, EventType };
