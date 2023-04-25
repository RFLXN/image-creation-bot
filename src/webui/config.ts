import WebuiConfig from "../type/webui-config";
import { getWebuiConfig } from "../config";
import { AUTOMATIC_ROOT, WEBUI_ROOT } from "../util/path";

let config: WebuiConfig;

const loadConfig = async () => {
    config = await getWebuiConfig();
};

const getServerPath = () => {
    if (config.altToAutomatic) {
        return AUTOMATIC_ROOT;
    }

    return WEBUI_ROOT;
};

export { loadConfig, getServerPath };
