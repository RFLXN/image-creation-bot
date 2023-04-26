import { createLogger, format, transports } from "winston";
import moment from "moment";

const infoLogger = createLogger({
    format: format.simple(),
    level: "info",
    transports: [
        new transports.File({
            filename: "./logs/bot-out.log"
        }),
        new transports.Console({
            level: "info"
        })
    ]
});

const errorLogger = createLogger({
    format: format.simple(),
    level: "error",
    transports: [
        new transports.File({
            filename: "./logs/bot-error.log"
        }),
        new transports.Console({
            level: "error"
        })
    ]
});

const log = (...data: any[]) => {
    infoLogger.log({
        level: "info",
        message: `[${moment().format("YYYY-MM-DD hh:mm:ss").trim()}] ${String(...data)}`
    });
};

const error = (...data: any[]) => {
    errorLogger.error({
        level: "error",
        message: `[${moment().format("YYYY-MM-DD hh:mm:ss").trim()}] ${String(...data)}`
    });
};

export { log, error };
