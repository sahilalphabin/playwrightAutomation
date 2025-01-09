// @ts-check
const {test, expect} = require('@playwright/test');

// const drag_and_drop = async(page,locator, offsetY,cnt) =>{

//     const box = await locator.boundignBox();
//     console.log(box);


//     await page.mouse.move(box.x + box.width / 2,box.y + box.height / 2);
//     await page.mouse.down();
// 	for(let i=0;i<cnt;i++){
// 		await page.mouse.move(box.x + box.width / 2,box.y + box.height / 2+offsetY*(i+1));
// 		console.log(box.x + box.width / 2, box.y + box.height / 2+offsetY*(i+1));
// 		page.waitForTimeout(100);
// 	}
//     await page.mouse.up();

// }

test('Figma log in and new File', async ({ page, context }) => {


    await page.goto('https://www.figma.com/files/team/', { timeout: 45000 });
    await page.getByPlaceholder("Email").fill('wicem34526@kvegg.com')
    await page.getByPlaceholder("Password").fill('dummy12qw@pass123',{timeout:1000})
    await page.getByText('Log in').click({timeout:10000})

    await page.getByText("New design file").click({timeout:10000})

    await page.waitForTimeout(20000);
    let elementHandle = await page.locator("#canvas");
    let rect = await elementHandle.boundingBox();

    await page.locator('//div[@data-tooltip="Rectangle"]').click()
    
    await page.mouse.down();
    
    
    await page.screenshot({ path: 'screenshot.png' });

})




