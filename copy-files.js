const {resolve} = require("path");
const {
    cp,
    readdir,
    access
} = require("fs/promises");
const {platform} = require("node:process");

const WEBUI = resolve(__dirname, "sd-server", "stable-diffusion-webui");
const AUTOMATIC = resolve(__dirname, "sd-server", "automatic");
const SD_FILES = resolve(__dirname, "resource", "sd-files");
const MODELS = resolve(SD_FILES, "models");

const isExist = async (path) => {
    try {
        await access(path);
        return true;
    } catch (e) {
        return false;
    }
}

const copyFile = async (src, dest) => {
    if (await isExist(dest)) {
        console.log(`Skip copy for already exist: ${dest}`);
        return;
    }

    const start = new Date();

    let success = false;
    try {
        console.log(`Copy: from '${src}'\n\tto '${dest}'`);
        await cp(src, dest, {recursive: true, force: true});
        success = true;
    } catch (e) {
        success = false;
    }

    const end = new Date();
    const diff = end.valueOf() - start.valueOf();

    if (success) {
        console.log(`Copied [${(diff / 1000).toFixed(3)} sec spent]: from '${src}'\n\tto '${dest}'`);
    } else {
        console.log(`Failed to copy: from '${src}'\n\tto '${dest}'`)
    }
}

const copyFiles = async (files, src, sdDest, autoDest) => {
    for (const fileName of files) {
        const target = resolve(src, fileName);
        const sdTarget = resolve(sdDest, fileName);
        const autoTarget = resolve(autoDest, fileName);

        await copyFile(target, sdTarget);
        await copyFile(target, autoTarget);
    }
}

const copyExtensions = async () => {
    const extensionFiles = (await readdir(resolve(SD_FILES, "extensions")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(SD_FILES, "extensions");
    const sdDest = resolve(WEBUI, "extensions");
    const autoDest = resolve(AUTOMATIC, "extensions");

    await copyFiles(extensionFiles, src, sdDest, autoDest);
};

const copyLoraFiles = async () => {
    const loraFiles = (await readdir(resolve(MODELS, "Lora")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "Lora");
    const sdDest = resolve(WEBUI, "models", "Lora");
    const autoDest = resolve(AUTOMATIC, "models", "Lora");

    await copyFiles(loraFiles, src, sdDest, autoDest);
};

const copyVaeFiles = async () => {
    const vaeFiles = (await readdir(resolve(MODELS, "VAE")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "VAE");
    const sdDest = resolve(WEBUI, "models", "VAE");
    const autoDest = resolve(AUTOMATIC, "models", "VAE");

    await copyFiles(vaeFiles, src, sdDest, autoDest);
};

const copySdModelFiles = async () => {
    const sdModelFiles = (await readdir(resolve(MODELS, "Stable-diffusion")))
        .filter(fileName => fileName !== ".placeholder");

    const src = resolve(MODELS, "Stable-diffusion");
    const sdDest = resolve(WEBUI, "models", "Stable-diffusion");
    const autoDest = resolve(AUTOMATIC, "models", "Stable-diffusion");

    await copyFiles(sdModelFiles, src, sdDest, autoDest);
};

const copyWebuiScripts = async () => {
    const py = resolve(__dirname, "webui.py");
    const sh = resolve(__dirname, "webui-user.sh");
    const bat = resolve(__dirname, "webui-user.bat");

    await cp(py, resolve(WEBUI, "webui.py"), {force: true});
    await cp(sh, resolve(WEBUI, "webui-user.sh"), {force: true});
    await cp(bat, resolve(WEBUI, "webui-user.bat"), {force: true});

    console.log(`File copied: '${py}'\n\tand '${sh}'\n\tand '${bat}'\n\tto '${WEBUI}'`);
};

(async () => {
    const start = new Date();

    await copySdModelFiles();
    await copyLoraFiles();
    await copyVaeFiles();
    await copyExtensions();
    await copyWebuiScripts();

    const end = new Date();
    const diff = end.valueOf() - start.valueOf();

    console.log(`All files copied! [${diff / 1000} sec spent]`);
})();
