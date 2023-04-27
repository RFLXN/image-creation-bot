interface RawInfoCreatedImage {
    base64images: string[];
    info: string;
}

interface ImageInfo {
    prompt: string;
    allPrompts: string[];
    negativePrompt: string;
    allNegativePrompts: string[];
    seed: number;
    allSeeds: number[];
    subseed: number;
    allSubseeds: number[];
    subseedStrength: number;
    width: number;
    height: number;
    samplerName: string;
    cfgScale: number;
    stept: number;
    batchSize: number;
    restoreFaces: boolean;
    faceRestorationModel: string;
    sdModelHash: string;
    seedResizeFromW: number;
    seedResizeFromH: number;
    denoisingStrength: number;
    extraGenerationParams: unknown;
    indexOfFirstImage: number;
    infotexts: string[],
    styles: string[],
    jobTimestamp: string;
    clipSkip: number;
    isUsingInpaintingConditioning: boolean;
}

interface CreatedImage {
    base64images: string[];
    info: ImageInfo;
}

interface Model {
    name: string;
    hash?: string;
}

interface Lora {
    name: string;
    weight?: number;
}

type ScriptParams = Record<string, string | number | boolean>;

type ScriptParamGenerator<T extends ScriptParams> = (args: T) => (string | number | boolean)[];

type Upscaler = "None" | "Lanczos" | "Nearest" | "ESRGAN_4x" | "LDSR" | "R-ESRGAN 4x+"
| "R-ESRGAN 4x+ Anime6B" | "ScuNET GAN" | "ScuNET PSNR" | "SwinIR 4x";

interface HighResFix {
    resizeWidth?: number;
    resizeHeight?: number;
    upscaleBy?: number;
    upscaler?: Upscaler;
    steps?: number;
    denoisingStrength?: number;
}

interface Script {
    scriptName: string;
    params: ScriptParams;
}

interface Preset {
    id: number;
    description: string;
    model: Model;
    vae?: string;
    lora?: Lora[];
    sampler?: string;
    defaultPrompt?: string;
    defaultNegativePrompt?: string;
    steps: number;
    height: number;
    width: number;
    batchSize?: number;
    cfgScale?: number;
    highResFix?: HighResFix;
    script?: Script;
}

export {
    RawInfoCreatedImage, Model, Preset, Lora,
    CreatedImage, ImageInfo, Upscaler, HighResFix,
    ScriptParams, ScriptParamGenerator, Script
};
