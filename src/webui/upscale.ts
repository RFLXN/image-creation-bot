import { img2img } from "./api/img2img";
import { FailResult, Result, SuccessResult } from "../type/result";
import { CreatedImage, Model } from "../type/image";

const SCRIPT_NAME = "sd upscale";

interface ImageUpscaleOptions {
    base64Image: string
    height: number;
    width: number;
    model: Model;
    vae?: string;
    steps: number;
    args: UpscaleScriptArgs;
    denoisingStrength: number;
}

interface UpscaleScriptArgs {
    overlap: number;
    upscalerIndex: string;
    scaleFactor: number;
}

const createScriptArgs = (args: UpscaleScriptArgs) => [SCRIPT_NAME, args.overlap, args.upscalerIndex, args.scaleFactor];

const upscaleImage = async (options: ImageUpscaleOptions): Promise<Result<CreatedImage>> => {
    try {
        const res = await img2img({
            initImages: [options.base64Image],
            height: options.height,
            width: options.width,
            steps: options.steps,
            scriptName: SCRIPT_NAME,
            scriptArgs: createScriptArgs(options.args),
            overrideSettings: {
                sdModelCheckpoint: options.model.name,
                sdCheckpointHash: options.model.hash,
                sdVae: options.vae ? options.vae : "Automatic"
            },
            denoisingStrength: options.denoisingStrength,
            saveImages: false
        });

        return {
            data: {
                info: res.info,
                base64image: res.images[0]
            },
            success: true
        } as SuccessResult<CreatedImage>;
    } catch (e) {
        return {
            success: false,
            error: e
        } as FailResult;
    }
};

export { ImageUpscaleOptions, UpscaleScriptArgs, upscaleImage };
