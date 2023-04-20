import { txt2img } from "./api";
import { createLoraTag } from "./lora";
import { FailResult, Result, SuccessResult } from "../type/result";
import { CreatedImage, Model } from "../type/image";

interface Lora {
    name: string,
    weight?: number
}

interface ImageCreationOption {
    prompt: string;
    negativePrompt?: string;
    model: Model;
    vae?: string;
    lora?: Lora[];
    height: number;
    width: number;
    steps: number;
}

const createImage = async (options: ImageCreationOption): Promise<Result<CreatedImage>> => {
    let { prompt } = options;

    if (options.lora) {
        options.lora.map((lora) => {
            prompt += `, ${createLoraTag(lora.name, lora.weight ? lora.weight : 1)}`;
        });
    }

    try {
        const res = await txt2img({
            prompt,
            negativePrompt: options.negativePrompt ? options.negativePrompt : null,
            height: options.height,
            width: options.width,
            steps: options.steps,
            overrideSettings: {
                sdModelCheckpoint: options.model.name,
                sdCheckpointHash: options.model.hash,
                sdVae: options.vae ? options.vae : "Automatic"
            },
            saveImages: false
        });
        return {
            success: true,
            data: {
                base64image: res.images[0],
                info: res.info
            }
        } as SuccessResult<CreatedImage>;
    } catch (e) {
        return {
            success: false,
            error: e
        } as FailResult;
    }
};

export {
    createImage, ImageCreationOption, CreatedImage, Lora, Model
};
