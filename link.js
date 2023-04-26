const {
    cp,
    readdir,
    access,
    symlink,
    rm,
    unlink,
    lstat
} = require("fs/promises");
const {platform} = require("node:process");
const {resolve} = require("path");

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
};

const isSymlink = async (target) => {
    try {
        const stat = await lstat(target);
        return stat.isSymbolicLink();
    } catch (e) {
        return false;
    }
};


const createSymlink = async (target, dest) => {
    try {
        if (platform === "win32") {
            await symlink(target, dest, "dir");
        } else {
            await symlink(target, dest);
        }
        console.log(`Symbolic link created: ${target}\n\tto ${dest}`);
    } catch (e) {
        console.log(`Failed to create symbolic link: ${target}\n\tto ${dest}`);
    }
};

const rmDir = async (target) => {
    try {
        await rm(target, {force: true, recursive: true});
        console.log(`Remove: ${target}`);
    } catch (e) {
        console.log(`Failed to remove: ${target}`);
    }
};

const rmLink = async (target) => {
    try {
        await unlink(target);
        console.log(`Unlink: ${target}`);
    } catch (e) {
        console.log(`Failed to unlink: ${target}`);
    }
};

const linkExtensions = async () => {
    console.log("Linking extensions...");

    const src = resolve(SD_FILES, "extensions");

    const extensions = (await readdir(src))
        .filter(f => f !== ".placeholder");


    const sdDest = resolve(WEBUI, "extensions");
    const autoDest = resolve(AUTOMATIC, "extensions");

    for (const extension of extensions) {
        const target = resolve(src, extension);
        const sd = resolve(sdDest, extension);
        const auto = resolve(autoDest, extension);


        if (await isExist(sd)) {
            if (await isSymlink(sd)) {
                await rmLink(sd);
            } else {
                await rmDir(sd);
            }
        }

        if (await isExist(auto)) {
            if (await isSymlink(auto)) {
                await rmLink(auto);
            } else {
                await rmDir(auto);
            }
        }

        await createSymlink(target, sd);
        await createSymlink(target, auto);
    }
};

const linkModel = async (src, sd, auto) => {
    if (await isExist(sd)) {
        if (await isSymlink(sd)) {
            await rmLink(sd);
        } else {
            await rmDir(sd);
        }
    }

    if (await isExist(auto)) {
        if (await isSymlink(auto)) {
            await rmLink(auto);
        } else {
            await rmDir(auto);
        }
    }

    await createSymlink(src, sd);
    await createSymlink(src, auto);
};

const linkSdModel = async () => {
    console.log("Linking Stable-diffusion models...");

    const src = resolve(MODELS, "Stable-diffusion");
    const sdDest = resolve(WEBUI, "models", "Stable-diffusion");
    const autoDest = resolve(AUTOMATIC, "models", "Stable-diffusion");

    await linkModel(src, sdDest, autoDest);
};

const linkLora = async () => {
    console.log("Linking Lora models...");

    const src = resolve(MODELS, "Lora");
    const sdDest = resolve(WEBUI, "models", "Lora");
    const autoDest = resolve(AUTOMATIC, "models", "Lora");

    await linkModel(src, sdDest, autoDest);
};

const linkVae = async () => {
    console.log("Linking VAE models...");

    const src = resolve(MODELS, "VAE");
    const sdDest = resolve(WEBUI, "models", "VAE");
    const autoDest = resolve(AUTOMATIC, "models", "VAE");

    await linkModel(src, sdDest, autoDest);
};

const copyWebuiScripts = async () => {
    console.log("Overwriting webui launch script...");

    const py = resolve(__dirname, "webui.py");
    const sh = resolve(__dirname, "webui-user.sh");
    const bat = resolve(__dirname, "webui-user.bat");

    await cp(py, resolve(WEBUI, "webui.py"), {force: true});
    await cp(sh, resolve(WEBUI, "webui-user.sh"), {force: true});
    await cp(bat, resolve(WEBUI, "webui-user.bat"), {force: true});

    console.log(`File copied: '${py}'\n\tand '${sh}'\n\tand '${bat}'\n\tto '${WEBUI}'`);
};

(async () => {
    await linkExtensions();
    await linkSdModel();
    await linkLora();
    await linkVae();
    await copyWebuiScripts();
})();
