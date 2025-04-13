
import { test, expect } from '@playwright/test';
import { PlaywrightCrawler, Dataset } from 'crawlee';
import { AxeBuilder } from '@axe-core/playwright'

const username = 'standard_user';
const password = 'secret_sauce';

//async function asynclogin() {
    
//}


test('test', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/v1/');
    await page.locator('[data-test="username"]').click();
    await page.locator('[data-test="username"]').fill(username);
    await page.locator('[data-test="password"]').click();
    await page.locator('[data-test="password"]').fill(password);
    await page.getByRole('button', { name: 'LOGIN' }).click();
    // Verify successful login by checking for a specific element on the next page
    await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');
    await expect(page.locator('.inventory_list')).toBeVisible();

    await page.waitForSelector('.title', { state: 'visible' }); // Ensure the element is visible
    await expect(page.locator('.title')).toHaveText('Swag Labs');
});