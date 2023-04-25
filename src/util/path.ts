import { resolve } from "path";

const SOURCE_ROOT = resolve(__dirname, "..");
const PROJECT_ROOT = resolve(SOURCE_ROOT, "..");
const RESOURCE_ROOT = resolve(PROJECT_ROOT, "resource");
const WEBUI_ROOT = resolve(PROJECT_ROOT, "sd-server", "stable-diffusion-webui");
const AUTOMATIC_ROOT = resolve(PROJECT_ROOT, "sd-server", "automatic");

export {
    SOURCE_ROOT,
    RESOURCE_ROOT,
    PROJECT_ROOT,
    WEBUI_ROOT,
    AUTOMATIC_ROOT,
    resolve
};
