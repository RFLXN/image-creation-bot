import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getLoraList } from "../../webui/lora";

const lora: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("lora")
        .setDescription("Get Lora list")
        .setDescriptionLocalizations({
            ko: "Lora 목록을 표시합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const loraList = await getLoraList();

        let s = "";
        loraList.map((loraName) => {
            s += `- ${loraName}\n`;
        });

        const embed = new EmbedBuilder();
        embed.setTitle("Lora List")
            .setDescription(s == "" ? "None" : s);

        await interaction.reply({ embeds: [embed] });
    }
};

export default lora;
