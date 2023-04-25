const {resolve} = require("path");
const {cp, readdir} = require("fs/promises");

const WEBUI = resolve(__dirname, "sd-server", "stable-diffusion-webui");
const AUTOMATIC = resolve(__dirname, "sd-server", "automatic");
const SD_FILES = resolve(__dirname, "resource", "sd-files");
const MODELS = resolve(SD_FILES, "models");

const copyFiles = async (files, src, sdDest, autoDest) => {
    files.map(async (fileName) => {
        const target = resolve(src, fileName);
        const sdTarget = resolve(sdDest, fileName);
        const autoTarget = resolve(autoDest, fileName);

        await cp(target, sdTarget, {
            recursive: true
        });
        await cp(target, autoTarget, {
            recursive: true
        });

        console.log(`File copied: '${target}'\n\tto '${sdTarget}'\n\tand '${autoTarget}'`);
    })

}

const copyExtensions = async () => {
    const extensionFiles = (await readdir(resolve(SD_FILES, "extensions")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(SD_FILES, "extensions");
    const sdDest = resolve(WEBUI, "extensions");
    const autoDest = resolve(AUTOMATIC, "extensions")

    await copyFiles(extensionFiles, src, sdDest, autoDest);
}

const copyLoraFiles = async () => {
    const loraFiles = (await readdir(resolve(MODELS, "Lora")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "Lora");
    const sdDest = resolve(WEBUI, "models", "Lora");
    const autoDest = resolve(AUTOMATIC, "models", "Lora");

    await copyFiles(loraFiles, src, sdDest, autoDest);
}

const copyVaeFiles = async () => {
    const vaeFiles = (await readdir(resolve(MODELS, "VAE")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "VAE");
    const sdDest = resolve(WEBUI, "models", "VAE");
    const autoDest = resolve(AUTOMATIC, "models", "VAE");

    await copyFiles(vaeFiles, src, sdDest, autoDest);
}

const copySdModelFiles = async () => {
    const sdModelFiles = (await readdir(resolve(MODELS, "Stable-diffusion")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "Stable-diffusion");
    const sdDest = resolve(WEBUI, "models", "Stable-diffusion");
    const autoDest = resolve(AUTOMATIC, "models", "Stable-diffusion");

    await copyFiles(sdModelFiles, src, sdDest, autoDest);
}

const copyWebuiScripts = async () => {
    const py = resolve(__dirname, "webui.py");
    const sh = resolve(__dirname, "webui-user.sh");
    const bat = resolve(__dirname, "webui-user.bat");

    await cp(py, resolve(WEBUI, "webui.py"));
    await cp(sh, resolve(WEBUI, "webui-user.sh"));
    await cp(bat, resolve(WEBUI, "webui-user.bat"));

    console.log(`File copied: '${py}'\n\tand '${sh}'\n\tand '${bat}'\n\tto '${WEBUI}'`);
}

(async () => {
    await copySdModelFiles();
    await copyLoraFiles();
    await copyVaeFiles();
    await copyExtensions();
    await copyWebuiScripts();
})();
