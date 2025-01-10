// @ts-check
const {test} = require('@playwright/test');
require('dotenv').config();

const fs = require('fs').promises;
const path = require('path');


let diagram = async (page)=>{
    await page.locator('//button[@data-testid="CreationBarButton--SHAPE_LIBRARY"]').click();


    await page.locator('//div[@data-testid="shapeLibrary__item_basic-rounded"]').click()
    await page.mouse.move(198, 177)
    await page.mouse.down()
    await page.mouse.up()
    await page.screenshot({path: 'ScreenShots/diagram.png'})

}


let freeHand = async (page, box) => {

    //Free Hand copied from html file called mouse-recorder.html
    const filePath = path.join('recorded-shapes', `shape1.json`);
    const data = await fs.readFile(filePath, 'utf8');       
    const shape = JSON.parse(data);


    await page.locator('//button[@data-testid="CreationBarButton--PEN"]').click();
    
    const xOffset = box.x + box.width/2;
    const yOffset = box.y + box.height/2;
    
    // Start the drawing
    await page.mouse.move(xOffset + shape.points[0].x, yOffset + shape.points[0].y);
    await page.mouse.down();
    
    // Draw through all points with small delays to simulate natural drawing
    for (let i = 1; i < shape.points.length; i++) {
        await page.mouse.move(xOffset + shape.points[i].x, yOffset + shape.points[i].y);
        await page.waitForTimeout(5); // Small delay for more natural movement
    }
    
    await page.mouse.up();
}

let draw_rect = async (page, box, x, y )=>{
    await page.locator('//button[@data-testid="CreationBarButton--FRAMES"]').click()
    /*  // box is canvas */
        console.log(box.x, box.y, box.width, box.height)
        let xStart = box.x + box.width/2 + x;
        let yStart = box.y + box.height/2 + y ;
        let xFinish = box.x + box.width/2 + 2*x;
        let yFinish = box.y + box.height/2 + 2*y;   

        mouse_move_down_up(page, xStart, yStart, xFinish, yFinish)
        await page.screenshot({ path: 'ScreenShots/rectScreenshotBeforeMove.png' });

        mouse_move_down_up(page, (xStart+xFinish)/2, (yStart+yFinish)/2, xFinish+50, yFinish+50)
        await page.screenshot({ path: 'ScreenShots/rectScreenshotAfterMove.png' });
    }

let draw_circle = async (page, box, x, y )=>{
    await page.locator('//button[@data-testid="CreationBarButton--SHAPES"]').click()
    await page.locator('//button[@aria-label="place circle shape"]').click()
    /*  // box is canvas */
        console.log(box.x, box.y, box.width, box.height)
        let xStart = box.x + box.width/2 + x;
        let yStart = box.y + box.height/2 + y ;
        let xFinish = box.x + box.width/2 + 2*x;
        let yFinish = box.y + box.height/2 + 2*y;   

        mouse_move_down_up(page, xStart, yStart, xFinish, yFinish)
        await page.screenshot({ path: 'ScreenShots/CircleScreenshotBeforeMove.png' });
        mouse_move_down_up(page, (xStart+xFinish)/2, (yStart+yFinish)/2, xFinish+50, yFinish+50)
        await page.screenshot({ path: 'ScreenShots/CircleScreenshotAfterMove.png' });
    }
    
    // Drag and Drop 
let mouse_move_down_up = async (page, xStart, yStart, xFinish, yFinish) =>{
        // ** can also use page.locator('"canvas").hover(x:60,y:70) **
        await page.mouse.move(xStart, yStart);
        await page.mouse.down();    
        await page.mouse.move(xFinish, yFinish);
        await page.mouse.up();
    }


test('Rectangle :: Miro log in--> New design File --> Create Rectangle --> Move Rectangle', async ({ page, context }) => {
    // ** Env variables a
    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS || !process.env.MIRO_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    await page.goto('https://www.miro.com/login', { timeout: 45000 });
    await page.getByPlaceholder("Enter your email address").fill(process.env.FIGMA_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(process.env.MIRO_PASS,{timeout:1000})
    await page.getByText('Continue with email').click({timeout:10000})


    await page.locator('//div[@data-role="boards-list"]//a').first().click({timeout:10000})

    // Get the canvas bounding box
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30000 });
    let box = await page.locator('canvas').first().boundingBox();
    if (!box) {
        throw new Error('Could not get canvas bounding box');
    }
    // Draw Works -- 
    await draw_rect(page, box, 10, 10)
    //await draw_circle(page,box,35,20)

    // freehand 
    //await freeHand(page, box);
})


test('Circle :: Miro log in--> New design File --> Create Circle --> Move Circle', async ({ page, context }) => {
    // ** Env variables a
    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS || !process.env.MIRO_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    await page.goto('https://www.miro.com/login', { timeout: 45000 });
    await page.getByPlaceholder("Enter your email address").fill(process.env.FIGMA_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(process.env.MIRO_PASS,{timeout:1000})
    await page.getByText('Continue with email').click({timeout:10000})


    await page.locator('//div[@data-role="boards-list"]//a').first().click({timeout:10000})

    // Get the canvas bounding box
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30000 });
    let box = await page.locator('canvas').first().boundingBox();
    if (!box) {
        throw new Error('Could not get canvas bounding box');
    }
    // Draw Works -- 
    //await draw_rect(page, box, 10, 10)
    await draw_circle(page,box,35,20)

    // freehand 
    //await freeHand(page, box);
})



test('Free hand :: Miro log in--> New design File --> Select pen --> Free hand ', async ({ page, context }) => {
    // ** Env variables a
    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS || !process.env.MIRO_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    await page.goto('https://www.miro.com/login', { timeout: 45000 });
    await page.getByPlaceholder("Enter your email address").fill(process.env.FIGMA_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(process.env.MIRO_PASS,{timeout:1000})
    await page.getByText('Continue with email').click({timeout:10000})
    await page.locator('//div[@data-role="boards-list"]//a').first().click({timeout:10000})
    // Get the canvas bounding box
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30000 });
    let box = await page.locator('canvas').first().boundingBox();
    if (!box) {
        throw new Error('Could not get canvas bounding box');
    }
    // Draw Works -- 
    //await draw_rect(page, box, 10, 10)
    //await draw_circle(page,box,35,20)

    // freehand 
    await freeHand(page, box);
})

test('diagram :: Miro log in--> New design File --> Select diagram --> diagram ', async ({ page, context }) => {
    // ** Env variables a
    if (!process.env.FIGMA_EMAIL || !process.env.FIGMA_PASS || !process.env.MIRO_PASS) {
        throw new Error('FIGMA_EMAIL and FIGMA_PASS environment variables must be set');
    }
    await page.goto('https://www.miro.com/login', { timeout: 45000 });
    await page.getByPlaceholder("Enter your email address").fill(process.env.FIGMA_EMAIL);
    await page.getByPlaceholder("Enter your password").fill(process.env.MIRO_PASS,{timeout:1000})
    await page.getByText('Continue with email').click({timeout:10000})


    await page.locator('//div[@data-role="boards-list"]//a').first().click({timeout:10000})

    // Get the canvas bounding box
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30000 });
    let box = await page.locator('canvas').first().boundingBox();
    if (!box) {
        throw new Error('Could not get canvas bounding box');
    }
    // Cant find in the playwright --> CreationBarButton--SHAPE_LIBRARY
    await diagram(page)

    // Draw Works -- 
    //await draw_rect(page, box, 10, 10)
    //await draw_circle(page,box,35,20)

    // freehand 
    //await freeHand(page, box);
})



    // Do't work
    // dialog box close 
    // const dialogSelector = '#dialog';
    // await page.waitForSelector(dialogSelector, { state: 'visible' });
    // await page.click('.closeButton-A0rWU');   

    // Doesnt Work --  
    // Frame name chnage --> Cant get it to Work !!
    // await open_frame(page)

    // Cant change frame name --> Difficult 
    // let open_frame = async (page) =>{

    //     await page.locator('//button[@data-testid="canvas-controls-open-frames-list"]').click()
    //     await page.getByText("Frame 1").hover()
    //     await page.getByText("Frame 1").click()
    //     await page.getByText("Frame").fill("Test Entry")
    //     //await page.locator('//div[@data-test-id="virtuoso-item-list"]')
    // }
