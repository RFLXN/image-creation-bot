import { getPreset } from "../preset";
import { FailResult } from "../../type/result";
import { generate } from "./generate";
import QueueManager, { AddedImageGenerateQueue } from "./queue";

interface BasicGenerateOption {
    userId: string;
    prompt: string;
    presetId: number;
}

const basicGenerate = async (option: BasicGenerateOption, beforeGen?: (queue: AddedImageGenerateQueue) => void) => {
    const preset = getPreset(option.presetId);
    if (!preset) {
        return {
            success: false,
            error: new Error(`Invalid preset ID: ${option.presetId}`)
        } as FailResult;
    }

    const o = {
        prompt: preset.defaultPrompt ? `${preset.defaultPrompt}, ${option.prompt}` : option.prompt,
        model: preset.model,
        vae: preset.vae ? preset.vae : null,
        lora: preset.lora ? preset.lora : null,
        height: preset.height,
        width: preset.width,
        sampler: preset.sampler ? preset.sampler : null,
        steps: preset.steps,
        batchSize: preset.batchSize ? preset.batchSize : null,
        cfgScale: preset.cfgScale ? preset.cfgScale : null,
        scriptArgs: preset.scriptArgs ? preset.scriptArgs : null
    };

    const queue = QueueManager.instance.addQueue({ userId: option.userId, option: o });

    if (beforeGen) beforeGen(queue);

    const result = await generate(o);

    if (result.success) {
        QueueManager.instance.pop();
    } else {
        QueueManager.instance.rejectQueue(queue);
    }

    return result;
};

export { BasicGenerateOption, basicGenerate };
