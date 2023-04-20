import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ContextMenuCommandBuilder,
    ContextMenuCommandInteraction,
    SlashCommandBuilder
} from "discord.js";

type CommandBuilder = SlashCommandBuilder | ContextMenuCommandBuilder;

interface Command {
    data: Partial<CommandBuilder>
}

interface SlashCommand extends Command {
    data: Partial<SlashCommandBuilder>,
    exec: (interaction: ChatInputCommandInteraction, command: Partial<SlashCommandBuilder>) => void
}

interface ContextMenuCommand extends Command {
    data: Partial<ContextMenuCommandBuilder>,
    exec: (interaction: ContextMenuCommandInteraction, command: Partial<ContextMenuCommandBuilder>) => void;
}

interface Autocomplete {
    commandName: string;
    optionName: string;
    exec: (interaction: AutocompleteInteraction) => void;
}

export {
    Command, SlashCommand, ContextMenuCommand, Autocomplete
};
