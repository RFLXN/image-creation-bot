import { post } from "./share";

const PATH = "/sdapi/v1/extra-single-image";

type Upscaler = "None" | "Lanczos" | "Nearest" | "ESRGAN_4x" | "LDSR" | "R-ESRGAN 4x+"
| "R-ESRGAN 4x+ Anime6B" | "ScuNET GAN" | "ScuNET PSNR" | "SwinIR 4x";

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
