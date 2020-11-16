const pupp = require("puppeteer");


async function run(url, address) {
    try{
        var browser = await pupp.launch({
            headless:false,
            lsowMo:100

        });
        
        // var browser = await pupp.launch();
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
       
        await page.click('[id="ui-id-41"]');
        await page.waitFor(3000);
        
        var data = await page.evaluate((trash=[]) =>{
            let doc = document.getElementById("PAYSTATION");

            // let table =doc.getElementsByTagName("table");


            let table = doc.getElementsByTagName("table")[0];
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
        console.log("Browser closed");
        console.log(data);
    }
    catch(err){
        console.log(err);
        await browser.close();
    }
}

var url = "https://mapapps.phoenix.gov/imap/imap.html";

var address = "1126 W Thunderhill Dr., Phoenix, AZ 85045";
// var address = "16608 S";




async function scraper(address, attempt){
    var url = "https://mapapps.phoenix.gov/imap/imap.html";
    var browser = await pupp.launch({
        headless:false,
        lsowMo:100

    });

    //   const browser = await chromeLambda.puppeteer.launch({
    //     args: chromeLambda.args,
    //     executablePath: await chromeLambda.executablePath,
    //   });
    // var browser = await pupp.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await page.click('[id="searchA_input"]');
  
      await page.keyboard.type(address);
      
      await page.keyboard.press('Enter')
      .then(() => {
          page.on('dialog', async dialog => {
              await dialog.dismiss();
            });
      });
      
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
      console.log(msg);
      return msg;
  }



 scraper(address, 0)