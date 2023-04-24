import { ChatInputCommandInteraction } from "discord.js";
import BotAdminCommand from "./command";
import { reloadModels } from "../../../webui/api/reload-models";

const reloadModel: BotAdminCommand = {
    name: "Reload models",
    exec: async (interaction: ChatInputCommandInteraction) => {
        await reloadModels();
        await interaction.reply("Models Reloaded");
    }
};

export default reloadModel;
