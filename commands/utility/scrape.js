import {scrapeData} from  '../../puppetscrape.js'

import { ActionRowBuilder, ButtonBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("scrape")
    .setDescription("scrape a webpage")
    .addStringOption(option => 
        option.setName('url')
            .setDescription('The URL of the webpage to scrape')
            .setRequired(true)
    )

const scrapeRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('Snapshot')
            .setLabel('Take Snapshot')
            .setStyle('Primary')
    )

export async function execute(interaction) {
    await interaction.deferReply({flags: MessageFlags.EPHEMERAL});
    const url = interaction.options.getString('url');
    
    try{
        const scraped = await scrapeData(url);
        console.log(scraped)
        if(scraped){
            await interaction.editReply({content: scraped.title, components: [scrapeRow]});
        }else{
            await interaction.editReply('an error occured')
        }
      
    }catch(error) {
        await interaction.editReply('an error in command execution occurred');
    }
}