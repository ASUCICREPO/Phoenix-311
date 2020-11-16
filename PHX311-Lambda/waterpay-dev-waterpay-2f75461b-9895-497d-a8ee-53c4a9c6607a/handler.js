
// this module will be provided by the layer
const chromeLambda = require("chrome-aws-lambda");

async function scraper(address, attempt){
  var url = "https://mapapps.phoenix.gov/imap/imap.html";


     // launch a headless browser
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
        let x =  document.querySelectorAll('.searchInputGroup > div')[1].querySelector("div > ul > li");
        if ( x ) {
          x.click();
        }
      });
    
    // await page.keyboard.press('Enter')
    // .then(() => {
    //     page.on('dialog', async dialog => {
    //         await dialog.dismiss();
    //       });
    // });
    
    await page.waitFor(500);
   
    await page.click('[id="ui-id-41"]');
    await page.waitFor(3000);
    
    var data = await page.evaluate((trash=[]) =>{
        let doc = document.getElementById("PAYSTATION");

        table =doc.getElementsByTagName("table")[0];
        if (table === undefined){
            return false;
        }
        trash[0] = {
          title: table.rows[1].cells[0].innerHTML,
          value: table.rows[1].cells[1].innerHTML,
      }
        return trash;
    });

    await browser.close();

    let msg = "Sorry some error has occured...";
    if(data === false && attempt < 2){
      msg = scraper(address, attempt+1);
    }
    else if(data === false && attempt >= 2){
      msg = "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information.";
    }
    else{
      msg = "To pay your City of Phoenix water bill in-person, visit " +  data[0].value + ".";
    }
    return msg;
}

module.exports.waterpay = async event => {

  var address = event.currentIntent.slots.UserAddress;

    let msg =  await scraper(address, 0);

    
    
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

