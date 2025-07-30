import puppeteer from 'puppeteer-extra';
//stealth plugin for puppeteer to allow for more expanded scraping
//should not be used maliciously
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
export const scrapeData = async (pageurl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageurl);

    const title = await page.title();
    console.log(`Title of the page: ${title}`);
    await browser.close();
    return { title: title }
}