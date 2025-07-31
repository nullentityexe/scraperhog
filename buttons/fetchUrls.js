import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { MessageFlags } from "discord.js";


puppeteer.use(StealthPlugin());


export const data = {customId: 'get_links'} 
export async function execute(interaction){
    await interaction.deferReply({flags: MessageFlags.EPHEMERAL});
    const scrapedurl = interaction.customId.split('|')[1];
    console.log(`scrapedurl: ${scrapedurl}`);
    if(scrapedurl){
        const urlList = await scrapeDataURLS(scrapedurl);
        await interaction.editReply({content: urlList.urls.join('\n')})
    }else{
        await interaction.editReply('no url scraped yet, run the scrape command first');
    }
}

const scrapeDataURLS = async (pageurl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageurl);

    const urls = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).map(anchor => anchor.href);
    });
    console.log(`urls: ${urls}`);
    await browser.close();
    return { urls: urls }
}
