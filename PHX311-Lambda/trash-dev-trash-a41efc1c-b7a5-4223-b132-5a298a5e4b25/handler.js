
// this module will be provided by the layer
const chromeLambda = require("chrome-aws-lambda");

async function scraper(address,attempt){
  var url = "https://mapapps.phoenix.gov/imap/imap.html";


    const browser = await chromeLambda.puppeteer.launch({
      args: chromeLambda.args,
      executablePath: await chromeLambda.executablePath,
    });

    const page = await browser.newPage();
    await page.goto(url);
    await page.click('[id="searchA_input"]');

    await page.keyboard.type(address);
    await page.waitFor(1000);
    await page.evaluate(() => {
      document.querySelectorAll('.searchInputGroup > div')[1].querySelector("div > ul > li").click();
    });
    
    // await page.keyboard.press('Enter')
    // .then(() => {
    //     page.on('dialog', async dialog => {
    //         await dialog.dismiss();
    //       });
    // });
    
    await page.waitFor(500);
   
    await page.click('[id="ui-id-10"]');
    await page.waitFor(500);
    
    var data = await page.evaluate((trash=[]) =>{
        let doc = document.getElementById("GarbagePickUp");

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

    await browser.close();

    let msg = "Sorry some error has occured...";
    if(data === false && attempt < 2){
      // msg = "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information. ";
      msg = scraper(address, attempt+1);
    }
    else if (data === false && attempt >= 2){
      msg = "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information. ";
    }
    else{
      msg = "For trash pick up at " + address + ", your trash will be picked up on " + data[0].value + " and recycling will be picked up " + data[1].value + "."
    }
    return msg;
    
}

module.exports.trashpickup = async event => {

  var address = event.currentIntent.slots.UserAddress;

 let msg =  await scraper(address, 0)
 return {
  "dialogAction": {
    "type": "Close",
    "fulfillmentState": "Fulfilled",
    "message":{
      "contentType": "PlainText",
      "content": msg
    }
  }
}


}

