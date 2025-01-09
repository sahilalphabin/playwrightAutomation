// @ts-check
const { test: setup } = require('@playwright/test');

setup('authenticate', async ({ page }) => {
  await page.goto('https://www.figma.com/login', { timeout: 45000 });
  await page.getByPlaceholder("Email").fill('wicem34526@kvegg.com')
  await page.getByPlaceholder("Password").fill('dummy12qw@pass123',{timeout:10000})


  await page.context().storageState({ path: 'playwright/.auth/user.json' });

});
