import { EventEmitter, EventType } from "../../util/event-emitter";
import { ImageGenerateOption } from "./generate";
import { randomInt } from "../../util/random";

interface ImageGenerateQueue {
    userId: string;
    option: ImageGenerateOption;
}

interface AddedImageGenerateQueue extends ImageGenerateQueue {
    id: number;
}

interface ImageGenerateQueueEvent extends EventType {
    queueAdded: [queue: AddedImageGenerateQueue]
    queuePopped: [queue: AddedImageGenerateQueue];
    queueRejected: [queue: AddedImageGenerateQueue];
}

class QueueManager extends EventEmitter<ImageGenerateQueueEvent> {
    private static readonly singleton = new QueueManager();

    private queue: AddedImageGenerateQueue[] = [];

    private constructor() {
        super();
    }

    public static get instance() {
        return this.singleton;
    }

    public addQueue(queue: ImageGenerateQueue): AddedImageGenerateQueue {
        const id = this.generateId();
        const q = { id, ...queue };
        this.queue.push(q);
        this.emit("queueAdded", q);
        return q;
    }

    public pop() {
        const q = this.queue.shift();
        this.emit("queuePopped", q);
        return q;
    }

    public rejectQueue(queue: AddedImageGenerateQueue) {
        const idx = this.queue.findIndex((q) => q.id == queue.id);
        if (idx != -1) {
            this.queue.splice(idx, 1);
            this.emit("queueRejected", queue);
            return true;
        }
        return false;
    }

    public getQueueLength() {
        return this.queue.length;
    }

    public getQueueIndex(queue: AddedImageGenerateQueue) {
        return this.queue.findIndex((q) => q.id == queue.id) + 1;
    }

    private generateId() {
        const ids = this.queue.map((q) => q.id);

        let id = -1;

        while (true) {
            const generated = randomInt(1, 999);
            const has = ids.find((i) => i == generated);
            if (!has) {
                id = generated;
                break;
            }
        }

        return id;
    }
}

export { AddedImageGenerateQueue };
export default QueueManager;
