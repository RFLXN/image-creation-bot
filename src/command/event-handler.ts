import SlashCommandManager from "./slash";
import ContextMenuCommandManager from "./context-menu";
import { error, log } from "../util/log";
import AutocompleteManager from "./autocomplete";

const applySlashCommandEventHandler = () => {
    const manager = SlashCommandManager.instance;

    manager.on("setCommand", (command) => {
        log(`Slash command loaded: ${command.data.name}`);
    });

    manager.on("commandsLoaded", (commands) => {
        log(`Every '${commands.length}' slash commands loaded`);
    });

    manager.on("commandRun", (command, interaction, start) => {
        log(`Run slash command: ${command.data.name} (${interaction.id})`);
    });

    manager.on("commandFinish", (command, interaction, start, end) => {
        const timeDiff = ((end.valueOf() - start.valueOf()) / 1000).toFixed(3);
        log(`Slash command finished: ${command.data.name} (${interaction.id}) [spent ${timeDiff} sec]`);
    });

    manager.on("commandFail", (command, interaction, e) => {
        if (!interaction.replied) {
            interaction.reply(e.message).catch((err) => error(err));
        }

        error(`Slash command failed: ${command.data.name} (${interaction.id})`);
        error(e);
    });
};

const applyContextMenuCommandEventHandler = () => {
    const manager = ContextMenuCommandManager.instance;

    manager.on("setCommand", (command) => {
        log(`Context menu command loaded: ${command.data.name}`);
    });

    manager.on("commandsLoaded", (commands) => {
        log(`Every '${commands.length}' context menu commands loaded`);
    });

    manager.on("commandRun", (command, interaction, start) => {
        log(`Run slash command: ${command.data.name} (${interaction.id})`);
    });

    manager.on("commandFinish", (command, interaction, start, end) => {
        const timeDiff = ((end.valueOf() - start.valueOf()) / 1000).toFixed(3);
        log(`Slash command finished: ${command.data.name} (${interaction.id}) [spent ${timeDiff} sec]`);
    });

    manager.on("commandFail", (command, interaction, e) => {
        if (!interaction.replied) {
            interaction.reply(e.message).catch((err) => error(err));
        }

        error(`Slash command failed: ${command.data.name} (${interaction.id})`);
        error(e);
    });
};

const applyAutocompleteEventHandler = () => {
    const manager = AutocompleteManager.instance;

    manager.on("setAutocomplete", (autocomplete) => {
        log(`Autocomplete Loaded: ${autocomplete.commandName}/${autocomplete.optionName}`);
    });

    manager.on("autocompleteLoaded", (autocompletes) => {
        log(`Every '${autocompletes.length}' autocompletes loaded.`);
    });

    manager.on("autocompleteRespond", (autocomplete, interaction, time) => {
        const key = `${autocomplete.commandName}/${autocomplete.optionName}`;
        log(`Autocomplete Responded: ${key} (${interaction.id})`);
    });

    manager.on("autocompleteFail", (autocomplete, interaction, e) => {
        const key = `${autocomplete.commandName}/${autocomplete.optionName}`;
        error(`Autocomplete failed: ${key} (${interaction.id})`);
        error(e);
    });
};

export { applySlashCommandEventHandler, applyContextMenuCommandEventHandler, applyAutocompleteEventHandler };
