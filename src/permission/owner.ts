import { readJson } from "../util/json";
import DiscordConfig from "../type/discord-config";
import { resolve, RESOURCE_ROOT } from "../util/path";

const getOwners = async () => {
    const discordConfig = await readJson<DiscordConfig>(resolve(RESOURCE_ROOT, "discord.json"));
    return discordConfig.owners;
};

const isOwner = async (id: string) => {
    const owners = await getOwners();
    const has = owners.find((o) => o == id);
    return !!has;
};

export default isOwner;
