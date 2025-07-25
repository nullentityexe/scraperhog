import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Replies with information about the bot.");

export async function execute(interaction) {
    await interaction.reply(`smileybot\nVersion: 1.0.0\nDescription: a bot that's all smiles`);
}