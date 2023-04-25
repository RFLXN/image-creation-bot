import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getScripts } from "../../webui/api/scripts";

const script: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("script")
        .setDescription("Get script list")
        .setDescriptionLocalizations({
            ko: "스크립트 목록을 표시합니다."
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const scripts = await getScripts();
        console.log(scripts);
    }
};

export default script;
