import { readdir } from "fs/promises";
import { AutocompleteInteraction } from "discord.js";
import { EventEmitter, EventType } from "../util/event-emitter";
import { Autocomplete } from "../type/discord-command";
import { resolve, SOURCE_ROOT } from "../util/path";
import { error, log } from "../util/log";

const AUTOCOMPLETE_PATH = resolve(SOURCE_ROOT, "command", "autocomplete");

interface AutocompleteEvent extends EventType {
    setAutocomplete: [autocomplete: Autocomplete];
    autocompleteLoaded: [autocompletes: Autocomplete[]];
    autocompleteRespond: [autocomplete: Autocomplete, interaction: AutocompleteInteraction, time: Date];
    autocompleteFail: [autocomplete: Autocomplete, interaction: AutocompleteInteraction, error: Error];
}

class AutocompleteManager extends EventEmitter<AutocompleteEvent> {
    private static readonly singleton = new AutocompleteManager();

    private readonly autocompletes = new Map<string, Autocomplete>();

    private constructor() {
        super();
    }

    public static get instance() {
        return this.singleton;
    }

    public getAutocompletes() {
        return Array.from(this.autocompletes.values());
    }

    public async loadAutocompletes() {
        try {
            const files = (await readdir(AUTOCOMPLETE_PATH))
                .filter((file) => file.endsWith(".js"));

            const raws = await Promise
                .allSettled(files.map((fileName) => import(`./autocomplete/${fileName}`)));

            raws.map((raw) => {
                if (raw.status == "rejected") {
                    error(raw.reason);
                    return;
                }

                const autocomplete: Autocomplete = raw.value.default;
                this.setAutocomplete(autocomplete);
            });
        } catch (e) {
            log("No autocomplete found. Skip registering.");
        } finally {
            this.emit("autocompleteLoaded", this.getAutocompletes());
        }
    }

    public async handleAutocomplete(interaction: AutocompleteInteraction) {
        const { commandName } = interaction;
        const currentFocused = interaction.options.getFocused(true);
        const key = `${commandName}/${currentFocused.name}`;

        const autocomplete = this.autocompletes.get(key);

        if (!autocomplete) {
            log(`Invalid autocomplete: ${key}`);
            return;
        }

        try {
            await autocomplete.exec(interaction);
            this.emit("autocompleteRespond", autocomplete, interaction, new Date());
        } catch (e) {
            this.emit("autocompleteFail", autocomplete, interaction, e as Error);
        }
    }

    private setAutocomplete(autocomplete: Autocomplete) {
        this.autocompletes.set(`${autocomplete.commandName}/${autocomplete.optionName}`, autocomplete);
        this.emit("setAutocomplete", autocomplete);
    }
}

export default AutocompleteManager;
