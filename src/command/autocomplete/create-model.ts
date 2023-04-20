import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import { Autocomplete } from "../../type/discord-command";
import { getModels } from "../../webui/api/models";

const createModelAutocomplete: Autocomplete = {
    commandName: "create",
    optionName: "model",
    exec: async (interaction: AutocompleteInteraction) => {
        const models = await getModels();

        const options: ApplicationCommandOptionChoiceData[] = models.map((model) => ({
            name: model.modelName,
            value: model.sha256
        }));

        await interaction.respond(options);
    }
};

export default createModelAutocomplete;
