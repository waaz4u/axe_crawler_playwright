// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './temp_routes.js';

// const startUrls = ['https://crawlee.dev'];
const startUrls = ['https://demoqa.com'];

const crawler = new PuppeteerCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
});

await crawler.run(startUrls);
