import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption
} from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import { getModels } from "../../webui/api/models";
import { createImage } from "../../webui/image-creation";
import { getLoraList } from "../../webui/lora";
import getVaeList from "../../webui/vae";

const data = new SlashCommandBuilder()
    .setName("create")
    .setDescription("create image")
    .setNameLocalizations({
        ko: "생성"
    })
    .setDescriptionLocalizations({
        ko: "이미지를 생성합니다"
    })
    .addStringOption(
        new SlashCommandStringOption()
            .setAutocomplete(true)
            .setName("model")
            .setDescription("model")
            .setNameLocalizations({
                ko: "모델"
            })
            .setDescriptionLocalizations({
                ko: "모델"
            })
            .setRequired(true)
    )
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("width")
            .setDescription("width")
            .setNameLocalizations({
                ko: "너비"
            })
            .setDescriptionLocalizations({
                ko: "너비"
            })
            .setRequired(true)
    )
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("height")
            .setDescription("height")
            .setNameLocalizations({
                ko: "높이"
            })
            .setDescriptionLocalizations({
                ko: "높이"
            })
            .setRequired(true)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName("prompt")
            .setDescription("prompt")
            .setNameLocalizations({
                ko: "프롬프트"
            })
            .setDescriptionLocalizations({
                ko: "프롬프트"
            })
            .setRequired(true)
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName("negative_prompt")
            .setDescription("negative prompt")
            .setNameLocalizations({
                ko: "부정프롬프트"
            })
            .setDescriptionLocalizations({
                ko: "부정 프롬프트"
            })
            .setRequired(false)
    );

const create: SlashCommand = {
    data,
    exec: async (interaction: ChatInputCommandInteraction) => {
        const models = await getModels();
        const lora = await getLoraList();
        const vae = await getVaeList();

        const modelHash = interaction.options.getString("model", true);
        const model = models.find((m) => m.sha256 == modelHash);
        const width = interaction.options.getInteger("width", true);
        const height = interaction.options.getInteger("height", true);
        const prompt = interaction.options.getString("prompt", true);
        const negativePrompt = interaction.options.getString("negative_prompt", false);

        if (!model) {
            await interaction.reply("Invalid Model Error.");
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Creating Image...")
            .setDescription(
                `Model: ${model.modelName}\n`
                + `Size: ${width} x ${height}\n`
                + `Prompt: ${prompt}\n`
                + `${negativePrompt ? `Negative prompt: ${negativePrompt}\n` : ""}`
            )
            .setTimestamp(new Date());

        const message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        const img = await createImage({
            prompt,
            negativePrompt: negativePrompt || null,
            height,
            width,
            model: {
                name: model.modelName,
                hash: modelHash
            },
            steps: 30,
            lora: lora.map((l) => ({ name: l, weight: 1 })),
            vae: vae.length > 0 ? vae[0] : null
        });

        if (img.success) {
            const imgBuffer = Buffer.from(img.data.base64image, "base64");

            const imgAttachment = new AttachmentBuilder(imgBuffer)
                .setName("image.png")
                .setDescription("AI created image");

            const successEmbed = new EmbedBuilder()
                .setTitle("Image created")
                .setDescription(img.data.info);
            await message.edit(
                {
                    embeds: [successEmbed],
                    files: [imgAttachment]
                }
            );
        } else {
            const failEmbed = new EmbedBuilder()
                .setTitle("Failed to create image")
                .setDescription(img.error.message);
            await message.edit({
                embeds: [failEmbed]
            });
        }
    }
};

export default create;
