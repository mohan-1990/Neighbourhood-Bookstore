const { test, expect } = require('@playwright/test');

test('Check logo text', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const logo = page.locator('.title a p');
  await expect(logo).toHaveText('Neighbourhood bookstore');
});

test('Clicking on shop now redirects to collections page', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.click('text=Shop Now');
    await expect(page).toHaveURL('http://localhost:3000/collections');
    await expect(page.locator('.title').first()).toBeVisible();
});

test('Existing user is able to login', async ({ page }) => {
    let email="mohan2@vikramam.com";
    await page.goto('http://localhost:3000/signin');
    await page.type("input[name=email]", email);
    await page.type("input[name=password]", "Test$1234");
    await page.click('button[type=submit]');
    await expect(page).toHaveURL('http://localhost:3000/collections');
});

test('Guest user is able to login', async ({ page }) => {
    await page.goto('http://localhost:3000/signin');
    await page.click('text=Continue as Guest');
    await expect(page).toHaveURL('http://localhost:3000/collections');
});