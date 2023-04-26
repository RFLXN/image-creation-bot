const {resolve} = require("path");
const {spawn} = require("child_process")
const {platform, exit, stdout, stderr, stdin} = require("node:process");
const {createLogger, format, transports} = require("winston");
const moment = require("moment");

const infoLogger = createLogger({
    format: format.simple(),
    level: "info",
    transports: [
        new transports.File({
            filename: "./logs/webui-out.log"
        })/*,
        new transports.Console({
            level: "info"
        })*/
    ]
});

const errorLogger = createLogger({
    format: format.simple(),
    level: "error",
    transports: [
        new transports.File({
            filename: "./logs/webui-error.log"
        })/*,
        new transports.Console({
            level: "error"
        })*/
    ]
});

const log = (...data) => {
    infoLogger.log({
        level: "info",
        message: `[${moment().format("YYYY-MM-DD hh:mm:ss").trim()}] ${String(...data)}`
    });
};

const error = (...data) => {
    errorLogger.error({
        level: "error",
        message: `[${moment().format("YYYY-MM-DD hh:mm:ss").trim()}] ${String(...data)}`
    });
};

const logExit = () => {
    log("----------------------------------");
    log("--------- Exit Process -----------");
    log("----------------------------------");
    error("----------------------------------");
    error("--------- Exit Process -----------");
    error("----------------------------------");
}

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

    webuiProcess.stdout.on("data", chunk => {
        log(chunk);
    });
    webuiProcess.stdout.pipe(stdout);

    webuiProcess.stderr.on("data", chunk => {
        error(chunk);
    });
    webuiProcess.stderr.pipe(stderr);

    stdin.pipe(webuiProcess.stdin);

    webuiProcess.on("exit", (code) => {
        logExit();
        exit(code);
    });
};

const runAutomatic = () => {
    const script = resolve(AUTOMATIC_PATH, AUTOMATIC_SCRIPT);

    const automaticProcess = spawn(script, {
        cwd: AUTOMATIC_PATH
    });

    automaticProcess.stdout.on("data", chunk => {
        log(chunk);
    });
    automaticProcess.stdout.pipe(stdout);

    automaticProcess.stderr.on("data", chunk => {
        error(chunk);
    })
    automaticProcess.stderr.pipe(stderr);

    stdin.pipe(automaticProcess.stdin);

    automaticProcess.on("exit", (code) => {
        logExit();
        exit(code);
    });
};

if (CONFIG.altToAutomatic) {
    runAutomatic();
} else {
    runWebUi();
}


