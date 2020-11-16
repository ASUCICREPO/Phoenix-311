const pupp = require("puppeteer");


async function scraper(address){
    var url = "https://mapapps.phoenix.gov/imap/imap.html";
  
    // var address = event.currentIntent.slots.UserAddress;
    // var address = ""
  
       // launch a headless browser
    //   const browser = await chromeLambda.puppeteer.launch({
    //     args: chromeLambda.args,
    //     executablePath: await chromeLambda.executablePath,
    //   });

    const browser = await pupp.launch();
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
      if(data === false){
        msg = "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information. ";
      }
      else{
        msg = "For trash pick up at " + address + ", your trash will be picked up on " + data[0].value + " and recycling will be picked up " + data[1].value + "."
      }
return  msg;

  }


// async function run(url, address) {
//     try{
//         var browser = await pupp.launch({
//             headless:false,
//             lsowMo:100

//         });
        
//         // var browser = await pupp.launch();
//         const page = await browser.newPage();
        
//         // await page.goto("https://mapapps.phoenix.gov/imap/imap.html");
//         await page.goto(url);
//         await page.click('[id="searchA_input"]');

//         // await page.keyboard.type('16608 S 14th St, Phoenix, AZ 85048');
//         // await page.keyboard.type('16608 S');
//         await page.keyboard.type(address);
        
//         await page.keyboard.press('Enter').then(() => {
//             page.on('dialog', async dialog => {
//                 await dialog.dismiss();
//                 return false;
//               });
//         });
        
//         await page.waitFor(500);
       
//         await page.click('[id="ui-id-10"]');
//         await page.waitFor(500);
        
//         var data = await page.evaluate((trash=[]) =>{
//             console.log('entered bulk trash');
//             let doc = document.getElementById("GarbagePickUp");

//             let table =doc.getElementsByTagName("table");


//             table =doc.getElementsByTagName("table")[0];
//             if (table === undefined){
//                 return false;
//             }
            
//             for(var i=0, row; row= table.rows[i]; i++){
//                     let title = row.cells[0].innerHTML;
//                     let value = row.cells[1].innerHTML;
//                     trash[i] = {
//                         title: title,
//                         value: value
//                     }
//             }
//             return trash;
//         });

//         await browser.close();
//         console.log("Browser closed");
//         console.log(data);
//     }
//     catch(err){
//         console.log(err);
//         await browser.close();
//     }
// }

var url = "https://mapapps.phoenix.gov/imap/imap.html";

var address = "1126 W Thunderhill Dr., Phoenix, AZ 85045";
// var address = "16608 S";

// run(url, address);


const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 6000, "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information.");
});

  Promise.race([scraper(address, 0), secondfunc()]).then((msg) => {
   console.log(msg);
  // return {
  //   "dialogAction": {
  //     "type": "Close",
  //     "fulfillmentState": "Fulfilled",
  //     "message":{
  //       "contentType": "PlainText",
  //       "content": msg
  //     }
  //   }
  // }
})
// console.log(x);
// lol(address);

function secondfunc(){
  setTimeout( 6000);
  return {
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": "Fulfilled",
      "message":{
        "contentType": "PlainText",
        "content": "This is address is not a City of Phoenix residential address. Please enter an address within Phoenix city limits for information. "
      }
    }
  
};
}


 