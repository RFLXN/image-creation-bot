import { post } from "./share";
import { Upscaler } from "../../type/image";

const PATH = "/sdapi/v1/extra-single-image";

enum ResizeMode {
    Amount = 0,
    HeightAndWeight = 1
}

interface ExtraImageReq {
    resizeMode: ResizeMode;
    showExtrasResults: boolean;
    gfpganVisibility: number;
    codeformerVisibility: number;
    codeformerWeight: number;
    upscalingResize: number;
    upscalingResizeW: number;
    upscalingResizeH: number;
    upscalingCrop: boolean;
    upscaler_1: Upscaler;
    upscaler_2: Upscaler;

    /**
     * for API call, this will be converted to extras_upcaler_2_visibility.
     */
    extrasUpscaler_2Visibility: number;
    upscaleFirst: boolean;
    image: string;
}

interface ExtraImageRes {
    htmlInfo: string;
    image: string;
}

const extraImage = async (data: Partial<ExtraImageReq>) => post<Partial<ExtraImageReq>, ExtraImageRes>(PATH, data);

export { ExtraImageReq, ExtraImageRes, extraImage };
