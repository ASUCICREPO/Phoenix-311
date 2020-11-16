const pupp = require("puppeteer");


async function run(url, address) {
    try{
        // var browser = await pupp.launch({
        //     headless:false,
        //     lsowMo:100

        // });
        
        var browser = await pupp.launch();
        const page = await browser.newPage();
        
        // await page.goto("https://mapapps.phoenix.gov/imap/imap.html");
        await page.goto(url);
        await page.click('[id="searchA_input"]');

        // await page.keyboard.type('16608 S 14th St, Phoenix, AZ 85048');
        // await page.keyboard.type('16608 S');
        await page.keyboard.type(address);
        
        await page.keyboard.press('Enter').then(() => {
            page.on('dialog', async dialog => {
                await dialog.dismiss();
                return false;
              });
        });
        
        await page.waitFor(500);
       
        await page.click('[id="ui-id-11"]');
        await page.waitFor(500);
        
        var data = await page.evaluate((trash=[]) =>{
            console.log('entered bulk trash');
            let doc = document.getElementById("BulkTrash");

            let table =doc.getElementsByTagName("table");


            table =doc.getElementsByTagName("table")[0];
            if (table === undefined){
                return false;
            }
            
            for(var i=0, row; row= table.rows[i]; i++){
                    let title = row.cells[0].innerHTML;
                    let value = row.cells[1].innerHTML;
                    trash[i] = {
                        title: title,
                        value: value
                    }
            }
            return trash;
        });

        await page.screenshot({ path: "./example.png"});
        await browser.close();
        console.log("Browser closed");
        console.log(data);
    }
    catch(err){
        console.log(err);
        await browser.close();
    }
}

var url = "https://mapapps.phoenix.gov/imap/imap.html";

var address = "16608 S 14th St, Phoenix, AZ 85048";
// var address = "16608 S";

run(url, address);

 