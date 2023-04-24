import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getSamplers } from "../../webui/api/sampler";

const sampler: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("sampler")
        .setDescription("Get sampler list")
        .setDescriptionLocalizations({
            ko: "샘플러 목록을 표시합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const samplers = await getSamplers();

        let s = "";
        samplers.map((sam) => {
            s += `- ${sam.name}\n`;
        });

        const embed = new EmbedBuilder();
        embed.setTitle("Samplers")
            .setDescription(s == "" ? "None" : s);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default sampler;
