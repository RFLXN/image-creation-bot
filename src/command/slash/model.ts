import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getModels } from "../../webui/api/models";

const model: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("model")
        .setDescription("Get model list")
        .setDescriptionLocalizations({
            ko: "모델 목록을 표시합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const models = await getModels();

        const embed = new EmbedBuilder();
        embed.setTitle("Models")
            .addFields(models.map((m) => ({
                name: m.title,
                value: `Hash: \n${m.sha256}`,
                inline: false
            })));

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default model;
