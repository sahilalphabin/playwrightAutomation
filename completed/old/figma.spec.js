// @ts-check
const {test} = require('@playwright/test');
require('dotenv').config();

// box is canvas 
let draw_rect = async (page, box, x, y )=>{
/*  // box is canvas */
    console.log(box.x, box.y, box.width, box.height)
    let xStart = box.x + box.width/2 + x;
    let yStart = box.y + box.height/2 + y ;
    let xFinish = box.x + box.width/2 + 2*x;
    let yFinish = box.y + box.height/2 + 2*y;
    mouse_move_down_up(page, xStart, yStart, xFinish, yFinish)
    return {xStart,yStart,xFinish,yFinish}
}

// Drag and Drop 
let mouse_move_down_up = async (page, xStart, yStart, xFinish, yFinish) =>{
    // ** can also use page.locator('"canvas").hover(x:60,y:70) **
    await page.mouse.move(xStart, yStart);
    await page.mouse.down();    
    await page.mouse.move(xFinish, yFinish);
    await page.mouse.up();
}

test('Figma log in --> New design File --> Create Rectangle --> Move triangle', async ({ page, context }) => {
    // ** Env variables a
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
    let rect1 = await draw_rect(page, box , 10, 50 )     

    // Move that rectangle rect1
    let {xStart, yStart, xFinish, yFinish} = rect1
    await page.mouse.move((xStart+xFinish)/2, (yStart+yFinish)/2)
    await page.mouse.down()
    await page.mouse.move(xFinish,yFinish)
    await page.mouse.up()
    await page.screenshot({ path: 'screenshot.png' });

 

    await page.screenshot({ path: 'screenshot.png' }); 
})



/* 

    // Trying to increase width of the rectangle drawn 
    // Using sliders on position label to chnage position 

    await page.mouse.down()
    let elemX = page.locator('//label[@data-onboarding-key="scrubbable-control-x-position"]')
    const boxx = await elemX.boundingBox()
    console.log('Element position:', boxx?.x, boxx?.y, 'size:', boxx?.width, boxx?.height)

    if (!boxx) {
        throw new Error('Could not find element position')
    }
    await page.mouse.up()
    await page.mouse.move(boxx.x, boxx.y+1)
    await page.mouse.down()
    await page.mouse.move(boxx.x+50, boxx.y)
    await page.mouse.up()

*/