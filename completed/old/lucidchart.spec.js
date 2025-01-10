// @ts-check

const {test} = require('@playwright/test')



test("lucidchart", async ({page,context} )=>{

    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    


    await page.goto('https://www.lucidchart.com/pages/') 
    await page.getByText("Log in").first().click()
    await page.locator('//input[@aria-label="Email or username"]').fill(process.env.FIGMA_EMAIL)
    await page.locator('//lucid-marketing-button[@data-test-id="next-login-button"]').first().click()
    await page.locator('//input[@aria-label="Password"]').fill(process.env.FIGMA_PASS)
    await page.locator('//div[@_ngcontent-ng-c3539790761]').click()



    await page.locator('//lucid-folder-entry-icon-item').click()


    await page.waitForTimeout(10000)

    await page.screenshot({path: 'ScreenShots/LucidScreenshots.png'})




})  