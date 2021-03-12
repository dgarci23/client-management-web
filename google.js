require("dotenv").config();
const {google} = require("googleapis");

const TOKEN_PATH = "token.json";
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const fixedKey = process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(new RegExp("\\\\n", "\g"), "\n")
const client = new google.auth.JWT(process.env.CLIENT_EMAIL, null, fixedKey,SCOPES);

client.authorize(function(error,tokens){
    if(error){console.log(error);return;}
    else
    {console.log("connected…");}
});

// General GS Sheet functions
async function gsupdate(range, values, id=process.env.TEST_ID){ //cl for client
    const gsapi=google.sheets({version:"v4", auth:client });
    
    
    const updateoptions={
        spreadsheetId: id,
        range:`${range}`,
        valueInputOption: "USER_ENTERED",
        resource:{values: values}
    };

    let resp = await gsapi.spreadsheets.values.update(updateoptions);
}

async function gsget(range, id=process.env.TEST_ID){
    const gsapi=google.sheets({version:"v4", auth: client });
    const opt={
        spreadsheetId: id,
        range:`${range}`
    };
    
    let dataObtained = await gsapi.spreadsheets.values.get(opt);

    return dataObtained;

}

// Client-specific GS Sheet functions
async function gsnewclient(){

    const gsapi = google.sheets({version:"v4", auth: client});
    const opt={
        spreadsheetId: process.env.TEST_ID,
        range:`Sheet1!A2:AQ2`
    };

    let dataObtained = await gsapi.spreadsheets.values.get(opt);

    return dataObtained;

}

async function gsdeleteclient(){

    const gsapi = google.sheets({version:"v4", auth: client});
    const opt={
        spreadsheetId: process.env.TEST_ID,
        resource: {
            "requests": 
            [
              {
                "deleteRange": 
                {
                  "range": 
                  {
                    "sheetId": 0, // gid
                    "startRowIndex": 1,
                    "endRowIndex": 2
                  },
                  "shiftDimension": "ROWS"
                }
              }
            ]
          }

    };

    await gsapi.spreadsheets.batchUpdate(opt);

    return "Success";
}

async function gsappendclient(range, values){

    const gsapi = google.sheets({version:"v4", auth: client});
    const opt_newRows = {
        spreadsheetId: process.env.RECEIVE_ID,
        resource:{
            requests: [{
                insertDimension: {
                    range: {
                        sheetId: 0,
                        dimension: "ROWS",
                        startIndex: 1,
                        endIndex: 2
                    }
                }
            }]
        }
    }

    await gsapi.spreadsheets.batchUpdate(opt_newRows);

    await gsupdate("Sheet1!A2:AQ2", values, process.env.RECEIVE_ID);

    return "Success";

}

async function gswriteclient(){

    let data = [];

    await gsnewclient().then((promise) => {

        data = promise.data.values;

        if (data !== undefined) {

            gsappendclient("Sheet1!A2:AQ2", data);
    
            gsdeleteclient();
        }
    });

    if (data===undefined) {
        return false;
    } else {
        return data[0];
    }

}

module.exports = {
    
    gsget: gsget,

    gsupdate: gsupdate,

    gswriteclient: gswriteclient

}
