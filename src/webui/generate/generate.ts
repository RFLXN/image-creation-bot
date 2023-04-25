// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import camelize from "camelize";
import {
    CreatedImage, ImageInfo, Lora, Model, RawInfoCreatedImage
} from "../../type/image";
import { createLoraTag } from "../lora";
import { txt2img } from "../api";
import { FailResult, Result, SuccessResult } from "../../type/result";

interface ImageGenerateOption {
    prompt: string;
    negativePrompt?: string;
    model: Model;
    vae?: string;
    lora?: Lora[];
    height: number;
    width: number;
    steps: number;
    sampler?: string;
    batchSize?: number;
    cfgScale?: number;
}

const generate = async (option: ImageGenerateOption): Promise<Result<CreatedImage | RawInfoCreatedImage>> => {
    try {
        let { prompt } = option;

        if (option.lora) {
            option.lora.map((lora) => {
                prompt += `, ${createLoraTag(lora.name, lora.weight ? lora.weight : 1)}`;
            });
        }

        const res = await txt2img({
            prompt,
            negativePrompt: option.negativePrompt ? option.negativePrompt : null,
            height: option.height,
            width: option.width,
            steps: option.steps,
            overrideSettings: {
                sdModelCheckpoint: option.model.name,
                sdCheckpointHash: option.model.hash,
                sdVae: option.vae ? option.vae : "Automatic"
            },
            samplerIndex: option.sampler ? option.sampler : "Euler",
            saveImages: false,
            sendImages: true,
            batchSize: option.batchSize ? option.batchSize : 1,
            cfgScale: option.cfgScale ? option.cfgScale : null
        });

        const { images, info } = res;

        let parsed;

        try {
            parsed = camelize(JSON.parse(info)) as ImageInfo;
        } catch (e) {
            // ignore when failed to parse
        }

        return {
            success: true,
            data: { info: parsed || info, base64images: images }
        } as SuccessResult<CreatedImage | RawInfoCreatedImage>;
    } catch (e) {
        return {
            success: false,
            error: e as Error
        } as FailResult;
    }
};

export { ImageGenerateOption, generate };
