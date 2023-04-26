import { EventEmitter, EventType } from "../../util/event-emitter";
import { ImageGenerateOption } from "./generate";
import { randomInt } from "../../util/random";
import { log } from "../../util/log";

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

    public getCurrentQueue() {
        if (this.queue.length > 0) {
            return this.queue[0];
        }
    }

    private generateId() {
        const ids = this.queue.map((q) => q.id);

        let id = -1;

        for (; ;) {
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

const applyEventHandlers = () => {
    const manager = QueueManager.instance;

    manager.on("queueAdded", (queue) => {
        let str = `Image generate queue added: ${queue.id} (from user: ${queue.userId})`
            + `\n\twith size: ${queue.option.width} x ${queue.option.height}`
            + `\n\twith model: ${queue.option.model.name}`
            + `\n\twith step: ${queue.option.steps}`
            + `\n\twith batch size: ${queue.option.batchSize ? queue.option.batchSize : 1}`
            + `${queue.option.sampler ? `\n\twith sampler: ${queue.option.sampler}` : ""}`
            + `${queue.option.vae ? `\n\twith vae: ${queue.option.vae}` : ""}`;

        if (queue.option.lora) {
            queue.option.lora.map((l) => {
                str += `\n\twith lora: ${l.name}`;

                if (l.weight) {
                    str += ` (${l.weight})`;
                }
            });
        }

        str += `\n\twith prompt: ${queue.option.prompt}`
            + `${queue.option.negativePrompt ? `\n\twith negative prompt: ${queue.option.negativePrompt}` : ""}`
            + `${queue.option.cfgScale ? `\n\twith cfg scale: ${queue.option.cfgScale}}` : ""}`;

        if (queue.option.highResFix) {
            const hr = queue.option.highResFix;

            str += `\n\twith HighRes.fix - ${hr.upscaler ? hr.upscaler : "Latent"}`;

            if (hr.steps) {
                str += ` / ${hr.steps} steps`;
            }

            if (hr.denoisingStrength) {
                str += ` / denoising ${hr.denoisingStrength}`;
            }

            if (hr.upscaleBy) {
                str += ` (x${hr.upscaleBy} size)`;
            } else if (hr.resizeWidth && hr.resizeHeight) {
                str += ` (size: ${hr.resizeWidth} x ${hr.resizeHeight})`;
            } else if (hr.resizeWidth && !hr.resizeHeight) {
                str += ` (width: ${hr.resizeWidth})`;
            } else if (hr.resizeHeight && !hr.resizeWidth) {
                str += ` (height: ${hr.resizeHeight})`;
            }
        }

        str += `${queue.option.scriptArgs ? `\n\twith script args: ${queue.option.scriptArgs}` : ""}`;

        log(str);
    });

    manager.on("queueRejected", (queue) => {
        log(`Image generate queue rejected: ${queue.id}`);
    });

    manager.on("queuePopped", (queue) => {
        log(`Queue Popped: ${queue.id}`);
    });
};

export { AddedImageGenerateQueue, applyEventHandlers };
export default QueueManager;
