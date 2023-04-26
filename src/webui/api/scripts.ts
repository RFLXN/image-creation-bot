import { get } from "./share";

const PATH = "/sdapi/v1/scripts";

interface GetScriptsRes {
    txt2img: string[];
    img2img: string [];
}

const getScripts = async () => get<GetScriptsRes>(PATH);

export { GetScriptsRes, getScripts };
