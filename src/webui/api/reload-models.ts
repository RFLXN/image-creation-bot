import { get } from "./share";

const PATH = "/sdapi/v1/reload-checkpoint";

const reloadModels = async () => get(PATH);

export { reloadModels };
