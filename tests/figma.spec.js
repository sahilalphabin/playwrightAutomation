// @ts-check
const {test} = require('@playwright/test');
require('dotenv').config();

let draw_rect = async (page, box)=>{
    console.log(box.x, box.y, box.width, box.height)
    let xStart = box.x + box.width / 3;
    let yStart = box.y + box.height / 2;
    let xFinish = box.x + box.width / 2;
    let yFinish = box.y + box.height / 3;
    mouse_move_down_up(page, xStart, yStart, xFinish, yFinish)
    return {xStart,yStart,xFinish,yFinish}
}

let mouse_move_down_up = async (page, xStart, yStart, xFinish, yFinish) =>{
    
    // ** can also use page.locator('"canvas").hover(x:60,y:70) **
    await page.mouse.move(xStart, yStart);
    await page.mouse.down();    
    await page.mouse.move(xFinish, yFinish);
    await page.mouse.up();
}

test('Figma log --> New design File --> Create Rectangle --> Move triangle', async ({ page, context }) => {
    // ** Env variables 
    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    //Login Figma 
    await page.goto('https://www.figma.com/files/team/', { timeout: 45000 });
    await page.getByPlaceholder("Email").fill(process.env.FIGMA_EMAIL);
    await page.getByPlaceholder("Password").fill(process.env.FIGMA_PASS,{timeout:1000})
    await page.getByText('Log in').click({timeout:10000})
    // Create new File 
    await page.getByText("New design file").click({timeout:10000})
    // Select rectangle tool 
    await page.locator('//div[@data-tooltip="Rectangle"]').click()

    // Get the canvas bounding box
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30000 });
    let box = await page.locator('canvas').boundingBox();
    if (!box) {
        throw new Error('Could not get canvas bounding box');
    }

    // draw rectangle 
    let rect1 = await draw_rect(page, box )
    await page.waitForTimeout(10000)
    
    // Move that rectangle rect1
    let {xStart, yStart, xFinish, yFinish} = rect1
    await page.mouse.move((xStart+xFinish)/2, (yStart+yFinish)/2)
    await page.mouse.down()
    await page.mouse.move(xFinish,yFinish)
    await page.mouse.up()
    await page.screenshot({ path: 'screenshot.png' });

    // Trying to increase width of the rectangle drawn 
    // await page.mouse.down()
    // let elemX = page.locator('//input[@data-testid="transform-width"]')
    // elemX.evaluate(elemX => elemX.setAttribute('value','133'))
    // let elemY = page.locator('//input[@data-testid="transform-height"]')
    // elemY.evaluate(elemY => elemY.setAttribute('value','233'))

    // await page.screenshot({ path: 'screenshot.png' });
})