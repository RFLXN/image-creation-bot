import { get } from "./share";

const PATH = "/sdapi/v1/samplers";

interface Sampler {
    name: string;
    aliases: string[];
    options: Record<string, string>
}

type GetSamplerRes = Sampler[];

const getSamplers = async () => get<GetSamplerRes>(PATH);

export { Sampler, GetSamplerRes, getSamplers };
