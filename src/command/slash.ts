import { readdir } from "fs/promises";
import { ChatInputCommandInteraction } from "discord.js";
import { resolve, SOURCE_ROOT } from "../util/path";
import { EventEmitter, EventType } from "../util/event-emitter";
import { SlashCommand } from "../type/discord-command";
import { error, log } from "../util/log";

const SLASH_PATH = resolve(SOURCE_ROOT, "command", "slash");

interface SlashCommandEvent extends EventType {
    setCommand: [command: SlashCommand];
    commandsLoaded: [commands: SlashCommand[]];
    commandRun: [command: SlashCommand, interaction: ChatInputCommandInteraction, start: Date];
    commandFail: [command: SlashCommand, interaction: ChatInputCommandInteraction, error: Error];
    commandFinish: [command: SlashCommand, interaction: ChatInputCommandInteraction, start: Date, end: Date];
}

class SlashCommandManager extends EventEmitter<SlashCommandEvent> {
    private static readonly singleton = new SlashCommandManager();

    private readonly commands = new Map<string, SlashCommand>();

    private constructor() {
        super();
    }

    public static get instance() {
        return this.singleton;
    }

    public getCommands() {
        return Array.from(this.commands.values());
    }

    /**
     * load all slash commands dynamically.
     */
    public async loadCommands() {
        try {
            const files = (await readdir(SLASH_PATH))
                .filter((file) => file.endsWith(".js"));

            const raws = await Promise.allSettled(files.map((fileName) => import(`./slash/${fileName}`)));

            raws.map((raw) => {
                if (raw.status == "rejected") {
                    error(raw.reason);
                    return;
                }

                const command: SlashCommand = raw.value.default;
                this.setCommand(command);
            });
        } catch (e) {
            log("No slash command found. Skip registering.");
        } finally {
            this.emit("commandsLoaded", this.getCommands());
        }
    }

    public async handleCommand(interaction: ChatInputCommandInteraction) {
        const command = this.commands.get(interaction.commandName);

        if (!command) {
            log(`Invalid command name: ${interaction.commandName}. Skipping handle...`);
            return;
        }

        const start = new Date();
        this.emit("commandRun", command, interaction, start);

        try {
            await command.exec(interaction, command.data);
        } catch (e) {
            this.emit("commandFail", command, interaction, e as Error);
        }

        const end = new Date();
        this.emit("commandFinish", command, interaction, start, end);
    }

    private setCommand(command: SlashCommand) {
        this.commands.set(command.data.name, command);
        this.emit("setCommand", command);
    }
}

export default SlashCommandManager;
