import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Replies with information about the bot.");

export async function execute(interaction) {
    await interaction.reply(`scraperhog\nVersion: 1.0.0\nDescription: scrape websites and access data from the comfort of discord`);
}