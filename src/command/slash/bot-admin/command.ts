import { ChatInputCommandInteraction } from "discord.js";

interface BotAdminCommand {
    name: string;
    exec: (interaction: ChatInputCommandInteraction) => void;
}

export default BotAdminCommand;
