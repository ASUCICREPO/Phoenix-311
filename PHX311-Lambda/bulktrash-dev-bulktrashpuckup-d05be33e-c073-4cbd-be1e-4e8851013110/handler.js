
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
  
      await browser.close();

      if(data === false && attempt < 2){
        msg = scraper(address, attempt + 1);
      }
      else if (data === false && attempt >= 2){
        msg = "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information.";
        // msg = "Your Bulk trash can be placed outside begining "
      }
      else{
        // msg = "For bulk trash pick up at " + address + ", your bulk trash can be placed outside on " + data[0].value+ " and it will be collected on " + data[1].value +".";
        msg = "Your bulk trash at address " + address + " can be placed outside begining " + data[0].value + " and collection begins the week of " + data[1].value + ".";
      }
      return msg;
}



module.exports.bulktrashpuckup = async event => {

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

