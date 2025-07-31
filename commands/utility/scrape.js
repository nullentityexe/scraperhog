import {scrapeData} from  '../../puppetscrape.js'
import { ActionRowBuilder, ButtonBuilder, ButtonComponent, MessageFlags, SlashCommandBuilder } from "discord.js";


var scrapedurl = null;
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
    scrapedurl = interaction.options.getString('url');
    
    try{
        var scrapedtitle = await scrapeData(scrapedurl);
        console.log(scrapedtitle)

        if(scrapedtitle){
            const scrapeRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('Snapshot')
                        .setLabel('Take Snapshot')
                        .setStyle('Primary'),
                    new ButtonBuilder()
                        .setCustomId(`get_links|${scrapedurl}`)
                        .setLabel('Fetch Links')
                        .setStyle('Secondary')
                )
            await interaction.editReply({content: scrapedtitle.title, components: [scrapeRow]});
          
        }else{
            await interaction.editReply('an error occured')
        }
      
    }catch(error) {
        await interaction.editReply('an error in command execution occurred');
    }
}

