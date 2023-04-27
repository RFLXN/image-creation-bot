import { ScriptParamGenerator, ScriptParams } from "../../type/image";
import Script from "./script";

type DddetailerModel = "bbox\\mmdet_anime-face_yolov3.pth [51e1af4a]"
| "segm\\mmdet_dd-person_mask2former.pth [3848e764]";

class DddetailerParams implements ScriptParams {
    [key: string]: (string | number | boolean);

    modelA: DddetailerModel;

    confidenceA?: number;

    dilationFactorA?: number;

    xOffsetA?: number;

    yOffsetA?: number;

    preProcessB?: boolean;

    bitwiseOperation?: "None" | "A&B" | "A-B";

    modelB?: DddetailerModel;

    confidenceB?: number;

    dilationFactorB?: number;

    xOffsetB?: number;

    yOffsetB?: number;

    maskBlur?: number;

    denoisingStrength?: number;

    inpaintFullResolution?: boolean;

    inpaintFullResolutionPadding?: number;

    cfgScale?: number;
}

const dddetailer: ScriptParamGenerator<DddetailerParams> = (params: DddetailerParams) => {
    const args: (string | number | boolean)[] = [];

    args.push("detection detailer");
    args.push(params.modelA);
    args.push(params.confidenceA ? params.confidenceA : 30);
    args.push(params.dilationFactorA ? params.dilationFactorA : 4);
    args.push(params.xOffsetA ? params.xOffsetA : 0);
    args.push(params.yOffsetA ? params.yOffsetA : 0);
    args.push(params.preProcessB ? params.preProcessB : false);
    args.push(params.bitwiseOperation ? params.bitwiseOperation : "None");
    args.push("");
    args.push(params.modelB ? params.modelB : "None");
    args.push(params.confidenceB ? params.confidenceB : 30);
    args.push(params.dilationFactorB ? params.dilationFactorB : 4);
    args.push(params.xOffsetB ? params.xOffsetB : 0);
    args.push(params.yOffsetB ? params.yOffsetB : 0);
    args.push(params.maskBlur ? params.maskBlur : 4);
    args.push(params.denoisingStrength ? params.denoisingStrength : 0.4);
    args.push(params.inpaintFullResolution ? params.inpaintFullResolution : true);
    args.push(params.inpaintFullResolutionPadding ? params.inpaintFullResolutionPadding : 32);
    args.push(params.cfgScale ? params.cfgScale : 7);
    args.push("");
    args.push("");

    return args;
};

const dddetailerScript: Script<DddetailerParams> = {
    name: "detection detailer",
    generator: dddetailer,
    type: DddetailerParams
};

export { DddetailerParams, dddetailerScript };
