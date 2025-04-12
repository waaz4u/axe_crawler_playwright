import { test, expect } from '@playwright/test';
import { PlaywrightCrawler, Dataset } from 'crawlee';

//############################################
const web_links = [];
const website_to_crawl = 'https://playwright.dev/';
//############################################

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        // log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        // await enqueueLinks();
        const enqueued_Links = await enqueueLinks({
            selector: 'a',
            // strategy: 'all',
        });
        web_links.push(request.url);
        // log.info(`Enqueued links from ${request.url}`);
    },

    // Uncomment this option to see the browser window.
    // headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 5,
});

//############################################
// Runs before each test.
//############################################
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`\r\n Running ${testInfo.title} \r\n`);
})

//############################################
// Runs after each test.
// It will take a screenshot of the page after each test.
// It will also log the status of the test and the URL of the page.
//############################################

test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    if (testInfo.status !== testInfo.expectedStatus)
        console.log(`\r\n Did not run as expected, ended up at ${page.url()} \r\n`);
    else    
        try{
            await page.screenshot({ path: 'screenshots/'+testInfo.title+Date.now()+'.png', fullPage: true });
        }
        catch (err) {
            console.log("Failed to get screenshot !!!")
        }
})
//############################################
// Tests
//############################################
// Test to run the crawler on playwright.dev website
test.describe.serial('Run crawler to get list', ()=>{
    test('test_01 - get_url_list', async () => {
        await crawler.run([website_to_crawl]);
        console.info(`links: ${web_links.join('\r\n')}`);
    });
});
//############################################