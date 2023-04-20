const {resolve} = require("path");
const {spawn} = require("child_process")
const {platform, exit, stdout, stderr} = require("node:process");

const WEBUI_PATH = resolve(__dirname, "stable-diffusion-webui");
const SCRIPT = platform === "win32" ? "webui-user.bat" : "webui.sh";

const webuiProcess = spawn(SCRIPT, {
    cwd: WEBUI_PATH
});

webuiProcess.stdout.pipe(stdout);
webuiProcess.stderr.pipe(stderr);

webuiProcess.on("exit", (code) => {
    exit(code);
});
