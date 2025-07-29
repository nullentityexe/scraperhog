import {scrapeData} from  '../../puppetscrape.js'

import { ActionRowBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("scrape")
    .setDescription("scrape a webpage")
    .addStringOption(option => 
        option.setName('url')
            .setDescription('The URL of the webpage to scrape')
            .setRequired(true)
    )

export async function execute(interaction) {
    await interaction.deferReply({flags: MessageFlags.EPHEMERAL});
    const url = interaction.options.getString('url');
    
    try{
        const scraped = await scrapeData(url);
        if(scraped){
            await interaction.editReply(scraped);
        }else{
            await interaction.editReply('an error occured')
        }
      
    }catch(error) {
        await interaction.editReply('an error in command execution occurred');
    }
}