import { get } from "./share";

const PATH = "/sdapi/v1/sd-models";

interface Model {
    title: string;
    modelName: string;
    hash: string;
    sha256: string;
    filename: string;
    config: string;
}

type GetModelRes = Model[];

const getModels = async () => get<GetModelRes>(PATH);

export { Model, GetModelRes, getModels };
