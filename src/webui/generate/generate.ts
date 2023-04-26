// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import camelize from "camelize";
import {
    CreatedImage, HighResFix, ImageInfo, Lora, Model, RawInfoCreatedImage
} from "../../type/image";
import { createLoraTag } from "../lora";
import { txt2img, Txt2imgReq } from "../api";
import { FailResult, Result, SuccessResult } from "../../type/result";
import omit from "../../util/omit";

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
    scriptArgs?: string[];
    highResFix?: HighResFix;
}

const generate = async (option: ImageGenerateOption): Promise<Result<CreatedImage | RawInfoCreatedImage>> => {
    try {
        let { prompt } = option;

        if (option.lora) {
            option.lora.map((lora) => {
                prompt += `, ${createLoraTag(lora.name, lora.weight ? lora.weight : 1)}`;
            });
        }

        let o: Partial<Txt2imgReq> = {
            prompt,
            negativePrompt: option.negativePrompt,
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
            cfgScale: option.cfgScale,
            scriptArgs: option.scriptArgs
        };

        if (!option.negativePrompt) {
            o = omit(o, "negativePrompt");
        }

        if (!option.cfgScale) {
            o = omit(o, "cfgScale");
        }

        if (!option.scriptArgs) {
            o = omit(o, "scriptArgs");
            o = omit(o, "scriptName");
        } else {
            o.scriptName = option.scriptArgs[0];
        }

        if (option.highResFix) {
            const opt = option.highResFix;
            o.enableHr = true;

            if (!opt.upscaler) {
                o.hrUpscaler = "Latent";
            } else {
                o.hrUpscaler = opt.upscaler;
            }

            if (opt.denoisingStrength) {
                o.denoisingStrength = opt.denoisingStrength;
            }

            if (opt.steps) {
                o.hrSecondPassSteps = opt.steps;
            }

            if (opt.upscaleBy) {
                o.hrScale = opt.upscaleBy;
            }

            if (opt.resizeHeight) {
                o.hrResizeY = opt.resizeHeight;
            }

            if (opt.resizeWidth) {
                o.hrResizeX = opt.resizeWidth;
            }
        }

        const res = await txt2img(o);

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
