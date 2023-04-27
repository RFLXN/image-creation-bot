import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import isOwner from "../../permission/owner";
import { commands } from "./bot-admin/index";

const botAdmin: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("bot-admin")
        .setDescription("Administrate bot")
        .addStringOption(
            new SlashCommandStringOption()
                .setName("command")
                .setDescription("admin command")
                .addChoices(
                    ...commands.map((c, i) => ({
                        name: c.name,
                        value: `${i}`
                    }))
                )
                .setRequired(true)
        ),
    exec: async (interaction: ChatInputCommandInteraction) => {
        if (!(await isOwner(interaction.user.id))) {
            await interaction.reply("Permission not allowed: Bot admin only.");
            return;
        }

        const commandIndex = interaction.options.getString("command", true);
        const command = commands[Number(commandIndex)];

        if (!command) {
            await interaction.reply("Invalid command");
            return;
        }

        await command.exec(interaction);
    }
};

export default botAdmin;
