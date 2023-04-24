import { get } from "./share";

const PATH = "/sdapi/v1/memory";

interface Ram {
    free: number;
    used: number;
    total: number;
}

interface UsedRam {
    current: number;
    peak: number;
}

interface Cuda {
    system: Ram;
    active: UsedRam;
    allocated: UsedRam;
    reserved: UsedRam;
    inactive: UsedRam;
    events: {
        retries: number;
        oom: number;
    }
}

interface GetMemoryRes {
    ram: Ram;
    cuda: Cuda;
}

const getMemory = async () => get<GetMemoryRes>(PATH);

export {
    GetMemoryRes, Ram, UsedRam, Cuda, getMemory
};
