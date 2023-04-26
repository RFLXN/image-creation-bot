import { get } from "./share";

const PATH = "/sdapi/v1/progress";

interface GetProgressRes {
    progress: number;
    etaRelative: number;
    state: {
        skipped: boolean;
        interrupted: boolean;
        job: string;
        jobCount: number;
        jotTimestamp: string;
        jobNo: number;
        samplingStep: number;
        samplingSteps: number;
    };
    currentImage?: string;
    textInfo?: string;
}

const getProgress = async () => get<GetProgressRes>(PATH);

export { GetProgressRes, getProgress };
