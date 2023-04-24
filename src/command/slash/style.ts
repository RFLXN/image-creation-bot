import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getPresetList } from "../../webui/preset";

const style: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("style")
        .setDescription("Get style list")
        .setDescriptionLocalizations({
            ko: "스타일 목록을 표시합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const presets = getPresetList();

        const embed = new EmbedBuilder()
            .setTitle("Style")
            .addFields(presets.map((p) => ({
                name: p.description,
                value: `ID: ${p.id}\nModel: ${p.model.name}\nVae: ${p.vae}\nLora: ${JSON.stringify(p.lora)}`,
                inline: false
            })));

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default style;
