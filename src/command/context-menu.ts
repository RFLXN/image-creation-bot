import { ContextMenuCommandInteraction } from "discord.js";
import { readdir } from "fs/promises";
import { EventEmitter, EventType } from "../util/event-emitter";
import { ContextMenuCommand } from "../type/discord-command";
import { error, log } from "../util/log";
import { resolve, SOURCE_ROOT } from "../util/path";

const CONTEXT_MENU_PATH = resolve(SOURCE_ROOT, "command", "context-menu");

interface ContextMenuCommandEvent extends EventType {
    setCommand: [command: ContextMenuCommand];
    commandsLoaded: [commands: ContextMenuCommand[]];
    commandRun: [command: ContextMenuCommand, interaction: ContextMenuCommandInteraction, start: Date];
    commandFail: [command: ContextMenuCommand, interaction: ContextMenuCommandInteraction, error: Error];
    commandFinish: [command: ContextMenuCommand, interaction: ContextMenuCommandInteraction, start: Date, end: Date];
}

class ContextMenuCommandManager extends EventEmitter<ContextMenuCommandEvent> {
    private static readonly singleton = new ContextMenuCommandManager();

    private readonly commands = new Map<string, ContextMenuCommand>();

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
            const files = (await readdir(CONTEXT_MENU_PATH))
                .filter((file) => file.endsWith(".js"));
            const raws = await Promise.allSettled(files.map((fileName) => import(`./context-menu/${fileName}`)));

            raws.map((raw) => {
                if (raw.status == "rejected") {
                    error(raw.reason);
                    return;
                }

                const command: ContextMenuCommand = raw.value.default;
                this.setCommand(command);
            });
        } catch (e) {
            log("No context command found. Skip registering.");
        } finally {
            this.emit("commandsLoaded", Array.from(this.commands.values()));
        }
    }

    public async handleCommand(interaction: ContextMenuCommandInteraction) {
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

    private setCommand(command: ContextMenuCommand) {
        this.commands.set(command.data.name, command);
        this.emit("setCommand", command);
    }
}

export default ContextMenuCommandManager;
