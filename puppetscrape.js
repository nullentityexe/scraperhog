import puppeteer from 'puppeteer';

export const scrapeData = async (pageurl) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(pageurl);

    const title = await page.title();
    console.log(`Title of the page: ${title}`);
    await browser.close();
    return title;
    
}