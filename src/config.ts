import { readJson } from "./util/json";
import DiscordConfig from "./type/discord-config";
import { resolve, RESOURCE_ROOT } from "./util/path";
import WebuiConfig from "./type/webui-config";

const DISCORD_CONFIG_PATH = resolve(RESOURCE_ROOT, "discord.json");
const WEBUI_CONFIG_PATH = resolve(RESOURCE_ROOT, "webui.json");

const getDiscordConfig = async () => readJson<DiscordConfig>(DISCORD_CONFIG_PATH);
const getWebuiConfig = async () => readJson<WebuiConfig>(WEBUI_CONFIG_PATH);

export { getWebuiConfig, getDiscordConfig };
