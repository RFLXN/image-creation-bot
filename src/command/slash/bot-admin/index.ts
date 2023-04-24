import BotAdminCommand from "./command";
import reloadModel from "./model-reload";
import reloadPreset from "./preset-reload";

const commands: BotAdminCommand[] = [
    reloadModel,
    reloadPreset
];

export { commands };
