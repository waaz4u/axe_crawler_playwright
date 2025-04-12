import { test, expect } from '@playwright/test';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { AxeBuilder } from '@axe-core/playwright'

//############################################
const web_links = [];
// Insert the link of the website you wish to crawl & check accessibility.
const website_to_crawl = 'https://playwright.dev/';
//############################################


//############################################
// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
//############################################
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, enqueueLinks, log }) {
        const title = await page.title();
        // log.info(`Title of ${request.loadedUrl} is '${title}'`);

        // Optional: Save results as JSON to ./storage/datasets/default
        await Dataset.pushData({ title, url: request.loadedUrl });

        // Extract links from the current page
        // and add them to the crawling queue.
    
        const enqueued_Links = await enqueueLinks({
            // get a links for pages rather than every link on the page. 
            selector: 'a',
            // strategy: 'all',
        });
        web_links.push(request.url);
        // log.info(`Enqueued links from ${request.url}`);
    },

    // Uncomment below option to see the browser window.
    // headless: false,

    // Let's limit our crawls to make our tests shorter and safer.
    maxRequestsPerCrawl: 10,
});

//############################################
// Runs before each test.
//############################################
test.beforeEach(async ({ page }, testInfo) => {
    console.log(`\r\n Running ${testInfo.title} \r\n`);
    await page.goto(website_to_crawl);
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
test.describe.serial('Accessibility Test', ()=>{
    test('test_01_get_url_list', async () => {
        await crawler.run([website_to_crawl]);
        console.info(`links: ${web_links.join('\r\n')}`);
    })

    // ToDo: Would be good to create a seperate test for each link rather than one test for all links.
    test('test_02_display_list', async ({page}) => {
        for (var i = 0; i < web_links.length; i++) {
            const link = web_links[i];
            await page.goto(link);
            // Update tags to check for various accessibility standards.
            // more info -- > https://www.deque.com/axe/core-documentation/api-documentation/
            const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
            expect(report.violations).toHaveLength(0)
            console.info(`------- > link checked: ${page.url()}`);
            }
        }) 

    test.skip('test_03_debug_placeholder_test_to_debug_individual_pages', async ({page}) => {
        const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze()
        expect(report.violations).toHaveLength(0)
    })
});
//############################################