import { get } from "./share";

const PATH = "/sdapi/v1/progress";

interface GetProgressRes {
    progress: number;
    etaRelative: number;
    state: any;
    currentImage: string;
    textInfo: string;
}

const getProgress = async () => get<GetProgressRes>(PATH);

export { GetProgressRes, getProgress };
