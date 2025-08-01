import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { AttachmentBuilder, MessageFlags } from "discord.js";


puppeteer.use(StealthPlugin());


export const data = {customId: 'get_links'} 
export async function execute(interaction){
    await interaction.deferReply({flags: MessageFlags.EPHEMERAL});
    const scrapedurl = interaction.customId.split('|')[1];
    console.log(`scrapedurl: ${scrapedurl}`);
    if(scrapedurl){
        const urlList = await scrapeDataURLS(scrapedurl);
        console.log(urlList)
        let urllength = urlList.urls.length;
        let response = urlList.urls.join('\n');
        const urlsattachment = new AttachmentBuilder(Buffer.from(`ScraperHog found ${urllength} urls: ${response}`), {name:`${scrapedurl}scrapedUrls.txt`});

        await interaction.editReply({content: 'Scraped Urls:', files: [urlsattachment]});
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
    await browser.close();
    return { urls: urls }
}
