import {
    ActionRowBuilder, AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder, Message, ModalBuilder,
    SelectMenuBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    StringSelectMenuOptionBuilder,
    TextChannel, TextInputBuilder, TextInputModalData, TextInputStyle
} from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getPresetList } from "../../webui/preset";
import QueueManager, { AddedImageGenerateQueue } from "../../webui/generate/queue";
import { presetBasedGenerate } from "../../webui/generate/preset-generate";

const doGenerate = async (interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder()
        .setTitle("Generate Image")
        .setDescription("Select Style");

    const presets = getPresetList();

    const menu = new StringSelectMenuBuilder()
        .setCustomId(`gen-basic-${interaction.id}`)
        .setPlaceholder("Select style from here")
        .addOptions(presets.map((preset) => new StringSelectMenuOptionBuilder()
            .setDescription(preset.description)
            .setValue(`${preset.id}`)
            .setLabel(preset.description)));

    const actionRow = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents(menu);

    const message = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
        components: [actionRow]
    });

    const target = (await (message.channel as TextChannel).awaitMessageComponent({
        time: 1000 * 60 * 3,
        filter: (i) => {
            if (i.user.id != interaction.user.id) return false;
            if (!i.isStringSelectMenu()) return false;
            if (i.customId != `gen-basic-${interaction.id}`) return false;

            return true;
        }
    })) as StringSelectMenuInteraction;

    const presetId = Number(target.values[0]);

    const preset = presets.find((p) => p.id == presetId);

    if (!preset) {
        await message.reply("Invalid Style");
        await message.delete();
        return;
    }

    const modal = new ModalBuilder()
        .setTitle("Prompt")
        .setCustomId(`gen-prompt-${interaction.id}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setLabel("Prompt")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setCustomId(`gen-prompt-input-${interaction.id}`)
                ),
            new ActionRowBuilder<TextInputBuilder>()
                .addComponents(
                    new TextInputBuilder()
                        .setLabel("Negative prompt")
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                        .setCustomId(`gen-neg-input-${interaction.id}`)
                )
        );

    await target.showModal(modal);
    const awaitedModal = await target.awaitModalSubmit({
        time: 1000 * 60 * 5,
        filter: (i) => {
            if (i.user.id != interaction.user.id) return false;
            if (!i.isModalSubmit()) return false;
            if (i.customId != `gen-prompt-${interaction.id}`) return false;

            return true;
        }
    });

    await message.delete();

    let prompt = "";
    let negativePrompt = "";

    awaitedModal.components.map((c) => c.components.map((input) => {
        const i = input as TextInputModalData;

        if (i.customId == `gen-prompt-input-${interaction.id}`) {
            prompt = i.value;
        }

        if (i.customId == `gen-neg-input-${interaction.id}`) {
            negativePrompt = i.value;
        }
    }));

    if (prompt == "") {
        await awaitedModal.reply("Invalid prompt");

        return;
    }

    let modalMessagePromise: Promise<Message<boolean>>;

    let q: AddedImageGenerateQueue;
    const result = await presetBasedGenerate({
        userId: interaction.user.id,
        prompt,
        negativePrompt: negativePrompt || null,
        presetId
    }, (queue) => {
        q = queue;
        const manager = QueueManager.instance;

        const queueEmbed = new EmbedBuilder()
            .setTitle("Generate Image")
            .setDescription(`Queued in position ${manager.getQueueIndex(queue)} with ID ${queue.id}`);

        modalMessagePromise = awaitedModal.reply({
            embeds: [queueEmbed],
            fetchReply: true
        });
    });

    if (!modalMessagePromise) return;

    const modalMessage = await modalMessagePromise;

    if (result.success) {
        const generatedEmbed = new EmbedBuilder()
            .setTitle("Image Generated!")
            .setDescription(`ID: ${q.id}\nStyle: ${preset.description}\nPrompt: ${prompt}`
                + `${negativePrompt != "" ? `\nNegative Prompt: ${negativePrompt}` : ""}`);

        await modalMessage.reply({
            embeds: [generatedEmbed],
            files: result.data.base64images.map((image) => new AttachmentBuilder(Buffer.from(image, "base64"))
                .setName("image.png"))
        });
        await modalMessage.delete();
    } else {
        await modalMessage.reply(`${result.error.message}`);
        await modalMessage.delete();
    }
};

const generate: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("generate")
        .setDescription("Generate image with AI")
        .setNameLocalizations({
            ko: "생성"
        })
        .setDescriptionLocalizations({
            ko: "AI로 이미지를 생성합니다"
        }),
    exec: async (interaction: ChatInputCommandInteraction) => {
        await doGenerate(interaction);
    }
};

export default generate;
