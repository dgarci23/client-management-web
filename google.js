const fs = require('fs');
const readline = require('readline');
const {GoogleSpreadsheet} = require("google-spreadsheet");
const {promisify} = require("util");

const creds = require("./creds.json");

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet("1by1-9FXUU7Rd1YwdgW5CtmLvtnMrVsEN45IAuYAjlEU");

    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key
    });


    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    const data = sheet.getCell(0,0);
    console.log(data);
}

accessSpreadsheet();