import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { AttachmentBuilder, MessageFlags } from "discord.js";


puppeteer.use(StealthPlugin());


export const data = {customId: 'Snapshot'} 
export async function execute(interaction){
    await interaction.deferReply({flags: MessageFlags.EPHEMERAL});
    const scrapedurl = interaction.customId.split('|')[1];
    console.log(`scrapedurl: ${scrapedurl}`);
    if(scrapedurl){

        const screenshots = await screenShotPage(scrapedurl);
      
        const screenshotAttachmentFullPage = new AttachmentBuilder(screenshots.fullpage, {name:`${scrapedurl}_fullpagescreenshot.png`});
        const screenshotAttachmentRegular = new AttachmentBuilder(screenshots.regular, {name:`${scrapedurl}_screenshot.png`});

        await interaction.editReply({content: `Snapped Screenshots for ${scrapedurl}`, files: [screenshotAttachmentRegular, screenshotAttachmentFullPage]});
    }else{
        await interaction.editReply('no url scraped yet, run the scrape command first');
    }
}


const screenShotPage = async (pageurl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageurl, {waitUntil: 'networkidle0'});
    const screenshotAttachmentFullPage = await page.screenshot({ fullPage: true});
    const screenshotAttachmentRegular = await page.screenshot();
    await browser.close();
    return {fullpage: screenshotAttachmentFullPage, regular: screenshotAttachmentRegular}
}
