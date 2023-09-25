var credentials = {}
credentials.email = process.env.REACT_APP_GOOGLE_EMAIL;
credentials.key = process.env.REACT_APP_GOOGLE_KEY;
credentials.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEET;
//console.log(process.env);
//console.log(credentials.key);
//console.log(process.env.REACT_APP_GOOGLE_KEY);

const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(credentials.spreadsheetId);

function getLocalDate(){
  // Create a new Date object
  const currentDate = new Date();

  // Adjust the time zone offset to GMT+3 (EEST)
  currentDate.setUTCHours(currentDate.getUTCHours());

  // Format the date as a string in ISO format
  //const isoDateGMTPlus3 = currentDate.toISOString();

  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = currentDate.getFullYear().toString().slice(-2);

  const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;
  return formattedDate;

}

async function saveToGoogleSheets(profileObj) {
  try{
    await doc.useServiceAccountAuth({
        client_email: credentials.email,
        private_key: credentials.key,
    });

    await doc.loadInfo(); // Loads document properties and worksheets

    const sheet = doc.sheetsByIndex[0];
    
    const row = { Email: profileObj.email, DateISO: getLocalDate(), Nome: profileObj.name};
    console.log(row);
    await sheet.addRow(row);
  }catch(e){
      console.log("erro inserindo sheet");
      console.log(e.message)
  }
}

export default saveToGoogleSheets;
