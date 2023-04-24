import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import getVaeList from "../../webui/vae";

const vae: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("vae")
        .setDescription("Get Vae list")
        .setDescriptionLocalizations({
            ko: "Vae 목록을 표시합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const vaeList = await getVaeList();

        let s = "";
        vaeList.map((v) => {
            s += `- ${v}\n`;
        });

        const embed = new EmbedBuilder();
        embed.setTitle("Vae List")
            .setDescription(s == "" ? "None" : s);

        await interaction.reply({
            embeds: [embed]
        });
    }
};

export default vae;
