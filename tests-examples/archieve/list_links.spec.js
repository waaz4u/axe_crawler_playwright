import { test, expect } from '@playwright/test';
import { PlaywrightCrawler, Dataset } from 'crawlee';

const links = [];
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        // log.info(`Title of ${request.loadedUrl} is '${title}'`);
        // log.info(`url = ${request.url}`);

        // Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
        const enqueuedLinks = await enqueueLinks({
            selector: 'a',
            // strategy: 'all',
        });
        
        links.push(JSON.stringify(enqueuedLinks, null, 2));
        log.info(`json links: ${JSON.stringify(enqueuedLinks, null, 2)}`);
    },
    // Uncomment this option to see the browser window.
    // headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 50,
});


test('get_list', async () => {
    await crawler.run(['https://playwright.dev']);
    // console.info(`links: ${links}`);
});