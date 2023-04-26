import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandInteraction,
    IntentsBitField,
    REST
} from "discord.js";
import { error, log } from "./util/log";
import {
    applyAutocompleteEventHandler,
    applyContextMenuCommandEventHandler,
    applySlashCommandEventHandler,
    AutocompleteManager,
    ContextMenuCommandManager,
    SlashCommandManager
} from "./command";
import { setCommands } from "./command-register";
import { Command } from "./type/discord-command";
import { loadPreset } from "./webui/preset";
import { getDiscordConfig } from "./config";
import { loadConfig } from "./webui/config";
import { applyEventHandlers } from "./webui/generate/queue";
import applyPresence from "./presence";

// top-level async wrap
(async () => {
    const discordConfig = await getDiscordConfig();

    const discordClient: Client<true> = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent
        ]
    });
    const discordRest = new REST();

    try {
        await discordClient.login(discordConfig.token);
        discordRest.setToken(discordConfig.token);
    } catch (e) {
        // shutting down when failed to log into discord
        error(e);
        process.exit(1);
    }

    discordClient.on("ready", async (client) => {
        log(`Bot Logged in as ${client.user.tag} (${client.user.id})`);
        log(`with Token: ${client.token}`);

        try {
            await loadConfig();
            applyEventHandlers();

            applySlashCommandEventHandler();
            applyContextMenuCommandEventHandler();
            applyAutocompleteEventHandler();
            await SlashCommandManager.instance.loadCommands();
            await ContextMenuCommandManager.instance.loadCommands();
            await AutocompleteManager.instance.loadAutocompletes();

            const commands: Command[] = []
                .concat(SlashCommandManager.instance.getCommands())
                .concat(ContextMenuCommandManager.instance.getCommands());

            await setCommands(discordRest, client.application.id, commands);

            await loadPreset();
            await applyPresence(client);
        } catch (e) {
            // shutting down when failed to register commands
            error(e);
            process.exit(1);
        }
    });

    discordClient.on("interactionCreate", (interaction) => {
        if (interaction.isChatInputCommand()) {
            const i = interaction as ChatInputCommandInteraction;
            SlashCommandManager.instance.handleCommand(i);
        }

        if (interaction.isContextMenuCommand()) {
            const i = interaction as ContextMenuCommandInteraction;
            ContextMenuCommandManager.instance.handleCommand(i);
        }

        if (interaction.isAutocomplete()) {
            const i = interaction as AutocompleteInteraction;
            AutocompleteManager.instance.handleAutocomplete(i);
        }
    });
})();
