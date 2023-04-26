import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getScripts } from "../../webui/api";

const script: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("script")
        .setDescription("Get script list")
        .setDescriptionLocalizations({
            ko: "스크립트 목록을 표시합니다."
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const scripts = await getScripts();

        let t2iStr = "";

        scripts.txt2img.map((s) => {
            t2iStr += `- ${s}\n`;
        });

        let i2iStr = "";

        scripts.img2img.map((s) => {
            i2iStr += `- ${s}\n`;
        });

        const embed = new EmbedBuilder()
            .setTitle("Script")
            .addFields(
                {
                    name: "Text to image",
                    value: t2iStr,
                    inline: false
                },
                {
                    name: "Image to image",
                    value: i2iStr,
                    inline: false
                }
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default script;
