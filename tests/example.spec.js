// @ts-check
const { test, expect } = require('@playwright/test');

test('Add Mouse to Cart on Amazon', async ({ page ,context}) => {
  await page.goto('https://www.amazon.in/', { timeout: 5000 });
  // let title = "Online Shopping site in India: Shop Online for Mobiles, Books, Watches, Shoes and More - Amazon.in"
  //await expect(page).toHaveTitle(title);
  await page.getByPlaceholder("Search Amazon.in").fill("Mouse", { timeout: 5000 });
  
  await page.locator('[id="nav-search-submit-button"]').click({ timeout: 5000 });
  await expect(page).toHaveTitle("Amazon.in : Mouse", { timeout: 5000 });
  

  await page.locator('//span[contains(text(), "Zebronics")]').first().click();
  const [newPage] = await Promise.all([
    context.waitForEvent('page'), 
    await page.getByText('DELL').first().click()
  ])

  await newPage.waitForLoadState();
  await newPage.getByText("Add to cart").first().click()
  await page.waitForTimeout(3000);
  await newPage.screenshot({ path: 'screenshot.png' });
  // Sign in  
  // await page.getByText("Hello, sign in").click();
  // await page.locator("[name='email']").fill("patelsahil.alphabin@gmail.com")
  // await page.locator("[name='']").fill("sahip12!@")


  //await page.getByRole('dialog', {name ,"signin"})

});



test('Flipkart add to cart',async ({page, context})=>{
  await page.goto('https://www.flipkart.com/', { timeout: 5000 });

  await page.getByPlaceholder('Search for Products, Brands and More').fill("Mouse", { timeout: 5000 });
  await page.getByPlaceholder('Search for Products, Brands and More').press("Enter");

  
  
  const [newPage] = await Promise.all([
      context.waitForEvent('page'), 
      await page.getByText('DELL').first().click()
    ])

  await newPage.waitForLoadState();
  await newPage.getByText("Add to cart").click()

  await expect(newPage).toHaveTitle("Shopping Cart | Flipkart.com", { timeout: 10000 })

  await newPage.screenshot({ path: 'screenshot.png' });
}); 