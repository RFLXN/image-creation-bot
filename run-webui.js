const {resolve} = require("path");
const {spawn} = require("child_process")
const {platform, exit, stdout, stderr} = require("node:process");

const CONFIG = require("./resource/webui.json");

const WEBUI_PATH = resolve(__dirname, "sd-server", "stable-diffusion-webui");
const WEBUI_SCRIPT = platform === "win32" ? "webui-user.bat" : "webui.sh";

const AUTOMATIC_PATH = resolve(__dirname, "sd-server", "automatic");
const AUTOMATIC_SCRIPT = platform === "win32" ? "webui.bat" : "webui.sh";

const runWebUi = () => {
    const script = resolve(WEBUI_PATH, WEBUI_SCRIPT)

    const webuiProcess = spawn(script, {
        cwd: WEBUI_PATH
    });

    webuiProcess.stdout.pipe(stdout);
    webuiProcess.stderr.pipe(stderr);

    webuiProcess.on("exit", (code) => {
        exit(code);
    });
};

const runAutomatic = () => {
    const script = resolve(AUTOMATIC_PATH, AUTOMATIC_SCRIPT);

    const automaticProcess = spawn(script, {
        cwd: AUTOMATIC_PATH
    });

    automaticProcess.stdout.pipe(stdout);
    automaticProcess.stderr.pipe(stderr);

    automaticProcess.on("exit", (code) => {
        exit(code);
    });
};

if (CONFIG.altToAutomatic) {
    runAutomatic();
} else {
    runWebUi();
}


