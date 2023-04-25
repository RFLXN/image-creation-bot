import { post } from "./share";

const PATH = "/sdapi/v1/reload-checkpoint";

const reloadModels = async () => post(PATH);

export { reloadModels };
