import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    ContextMenuCommandInteraction,
    IntentsBitField,
    REST
} from "discord.js";
import { readJson } from "./util/json";
import { resolve, RESOURCE_ROOT } from "./util/path";
import DiscordConfig from "./type/discord-config";
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

// top-level async wrap
(async () => {
    const discordConfig = await readJson<DiscordConfig>(resolve(RESOURCE_ROOT, "discord.json"));

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
