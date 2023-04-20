import { get } from "./share";

const PATH = "/sdapi/v1/scripts";

interface GetScriptsRes {
    txt2img: any[];
    img2img: any[];
}

const getScripts = async () => get<GetScriptsRes>(PATH);

export { GetScriptsRes, getScripts };
