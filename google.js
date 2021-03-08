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


async function gsupdate(range, values){ //cl for client
    const gsapi=google.sheets({version:"v4", auth:client });
    
    
    const updateoptions={
        spreadsheetId: process.env.PEDIDOS_ID,
        range:`${range}`,
        valueInputOption: "USER_ENTERED",
        resource:{values: values}
    };

    let resp = await gsapi.spreadsheets.values.update(updateoptions);
}


async function gsget(range){
    const gsapi=google.sheets({version:"v4", auth: client });
    const opt={
        spreadsheetId: process.env.PEDIDOS_ID,
        range:`${range}`
    };
    
    let dataObtained = await gsapi.spreadsheets.values.get(opt);

    return dataObtained;

}

module.exports = {
    
    gsget: gsget,

    gsupdate: gsupdate

}



