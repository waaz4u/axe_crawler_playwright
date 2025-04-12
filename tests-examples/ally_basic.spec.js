import { test, expect } from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright'


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

test.describe('a11y', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('https://playwright.dev/');
    });

    test('axe', async ({page}) => {
        const report = await new AxeBuilder({page}).withTags(['wcag2a', 'wcag2aa']).analyze()
        expect(report.violations).toHaveLength(0)
      })
    })

//############################################