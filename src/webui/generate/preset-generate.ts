import { getPreset } from "../preset";
import { FailResult } from "../../type/result";
import { generate, ImageGenerateOption } from "./generate";
import QueueManager, { AddedImageGenerateQueue } from "./queue";

interface PresetGenerateOption {
    userId: string;
    prompt: string;
    negativePrompt?: string;
    presetId: number;
}

const presetBasedGenerate = async (
    option: PresetGenerateOption,
    beforeGen?: (queue: AddedImageGenerateQueue) => void
) => {
    const preset = getPreset(option.presetId);
    if (!preset) {
        return {
            success: false,
            error: new Error(`Invalid preset ID: ${option.presetId}`)
        } as FailResult;
    }

    const o: Partial<ImageGenerateOption> = {
        model: preset.model,
        height: preset.height,
        width: preset.width,
        steps: preset.steps
    };

    if (preset.defaultPrompt) {
        o.prompt = `${preset.defaultPrompt}, ${option.prompt}`;
    } else {
        o.prompt = option.prompt;
    }

    if (preset.defaultNegativePrompt && option.negativePrompt) {
        o.negativePrompt = `${preset.defaultNegativePrompt}, ${option.negativePrompt}`;
    } else if (preset.defaultNegativePrompt && !option.negativePrompt) {
        o.negativePrompt = preset.defaultNegativePrompt;
    } else if (!preset.defaultNegativePrompt && option.negativePrompt) {
        o.negativePrompt = option.negativePrompt;
    }

    if (preset.vae) {
        o.vae = preset.vae;
    }

    if (preset.lora) {
        o.lora = preset.lora;
    }

    if (preset.sampler) {
        o.sampler = preset.sampler;
    }

    if (preset.batchSize) {
        o.batchSize = preset.batchSize;
    }

    if (preset.cfgScale) {
        o.cfgScale = preset.cfgScale;
    }

    if (preset.scriptArgs) {
        o.scriptArgs = preset.scriptArgs;
    }

    if (preset.highResFix) {
        o.highResFix = preset.highResFix;
    }

    const queue = QueueManager.instance.addQueue({ userId: option.userId, option: o as ImageGenerateOption });

    if (beforeGen) beforeGen(queue);

    const result = await generate(o as ImageGenerateOption);

    if (result.success) {
        QueueManager.instance.pop();
    } else {
        QueueManager.instance.rejectQueue(queue);
    }

    return result;
};

export { PresetGenerateOption, presetBasedGenerate };
