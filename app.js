// dotenv config
require("dotenv").config();
// Initialize Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const gs = require("./google");

// Initialize App
const app = express();

// Set App
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Mongoose connection
mongoose.connect(`mongodb+srv://dgarci23:${process.env.DB_PASSWORD}@cluster0.vovxs.mongodb.net/clientManagementDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

// Mongoose schema and model
const userSchema = new mongoose.Schema({
    
    user: String,
    password: String,
    privilege: String,
    branch: String

});


const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {

    res.sendFile(__dirname + "/public/views/login.html");

});

app.post('/', (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    User.findOne({user: user}, (err, userFound)=>{

        if (!err) {
            if (userFound) {

                bcrypt.compare(password, userFound.password, (err, check) => {
    
                    if (check) {
                        res.sendFile(__dirname + "/public/views/clients.html");
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                res.redirect('/');
            }
        }
    });
});

app.get('/new', (req, res) => {

    const range = "Form Responses 2!A2:AQ2";

    gs.gsget(range).then((data) => res.send(data.data.values));

    

})


// Listening on port
app.listen(3000, () => console.log("Listening on port 3000."));