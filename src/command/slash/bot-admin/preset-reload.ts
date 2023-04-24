import { ChatInputCommandInteraction } from "discord.js";
import BotAdminCommand from "./command";
import { loadPreset } from "../../../webui/preset";

const reloadPreset: BotAdminCommand = {
    name: "Reload presets",
    exec: async (interaction: ChatInputCommandInteraction) => {
        await loadPreset();
        await interaction.reply("Presets reloaded");
    }
};

export default reloadPreset;
