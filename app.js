// Initialize Packages
const express = require('express');

// Initialize App
const app = express();

// Set App
app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile(__dirname + "/public/views/login.html");

});


// Listening on port
app.listen(3000, () => console.log("Listening on port 3000."))