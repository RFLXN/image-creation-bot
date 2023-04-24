import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommand } from "../../type/discord-command";
import doBasic from "./generate/basic";
import doAdvanced from "./generate/advanced";

const generate: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("generate")
        .setDescription("Generate image with AI")
        .setNameLocalizations({
            ko: "생성"
        })
        .setDescriptionLocalizations({
            ko: "AI로 이미지를 생성합니다"
        })
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("basic")
                .setDescription("Generate image simply")
                .setNameLocalizations({
                    ko: "일반"
                })
                .setDescriptionLocalizations({
                    ko: "간단하게 이미지를 생성합니다"
                })
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName("advanced")
                .setDescription("Generate image advancedly")
                .setNameLocalizations({
                    ko: "고급"
                })
                .setDescriptionLocalizations({
                    ko: "세부적인 설정으로 이미지를 생성합니다"
                })
        ),
    exec: async (interaction: ChatInputCommandInteraction) => {
        const option = interaction.options.getSubcommand(true);

        if (option == "basic") {
            await doBasic(interaction);
        } else if (option == "advanced") {
            await doAdvanced(interaction);
        } else {
            await interaction.reply("Invalid Command.");
        }
    }
};

export default generate;
