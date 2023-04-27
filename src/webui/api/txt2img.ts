import { post } from "./share";
import { Config } from "./config";

interface Txt2imgReq {
    enableHr: boolean,
    denoisingStrength: number;
    firstphaseWidth: number;
    firstphaseHeight: number;
    hrScale: number;
    hrUpscaler: string;
    hrSecondPassSteps: number;
    hrResizeX: number;
    hrResizeY: number;
    prompt: string;
    styles: string[];
    seed: number;
    subseed: number;
    subseedStrength: number;
    seedResizeFromH: number;
    seedResizeFromW: number;
    samplerName: string;
    batchSize: number;
    n_tire: number;
    steps: number;
    cfgScale: number;
    width: number;
    height: number;
    restoreFaces: boolean;
    tiling: boolean;
    doNotHaveSamples: boolean;
    doNotSaveGrid: boolean;
    negativePrompt: string;
    eta: number;
    sChurn: number;
    sTmax: number;
    sTmin: number;
    sNoise: number;
    overrideSettings: Partial<Config>;
    overrideSettingsRestoreAfterwards: boolean;
    scriptArgs: (string | number | boolean)[];
    samplerIndex: string;
    scriptName: string;
    sendImages: boolean;
    saveImages: boolean;
    alwaysonScripts: any;
}

interface Txt2imgRes {
    images: string[];
    parameters: any;
    info: string;
}

const PATH = "/sdapi/v1/txt2img";

const txt2img = async (data: Partial<Txt2imgReq>) => post<Partial<Txt2imgReq>, Txt2imgRes>(PATH, data);

export { Txt2imgRes, Txt2imgReq, txt2img };
