import { Config } from "./config";
import { post } from "./share";

const PATH = "/sdapi/v1/img2img";

interface Img2imgReq {
    /**
     * base64 images
     */
    initImages: string[];
    denoisingStrength: number;
    imageCfgScale: number;
    mask: string;
    maskBlur: number;
    inpaintingFill: number;
    inpaintFullRes: boolean;
    inpaintFullResPadding: number;
    inpaintingMaskInvert: number;
    initialNoiseMultiplier: number;
    prompt: string;
    styles: string[];
    seed: number;
    subseed: number;
    subseedStrength: number;
    seedResizeFromH: number;
    seedResizeFromW: number;
    samplerName: string;
    batchSize: number;
    nIter: number;
    steps: number;
    cfgScale: number;
    width: number;
    height: number;
    restoreFaces: boolean;
    tiling: boolean;
    doNotSaveSamples: boolean;
    doNotSaveGrid: boolean;
    negativePrompt: string;
    eta: number;
    sChurn: number;
    sTmax: number;
    sTmin: number;
    sNoise: number;
    overrideSettings: Partial<Config>;
    overrideSettingsRestoreAfterwards: boolean;
    scriptArgs: (string | number)[];
    samplerIndex: string;
    includeInitImages: boolean;
    scriptName: string;
    sendImages: boolean;
    saveImages: boolean;
    alwaysonScripts: any;

    [key: string]: any;
}

interface Img2imgRes {
    images: string[];
    parameters: any;
    info: string;
}

const img2img = async (data: Partial<Img2imgReq>) => post<Partial<Img2imgReq>, Img2imgRes>(PATH, data);

export { Img2imgRes, Img2imgReq, img2img };
