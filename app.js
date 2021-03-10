// dotenv config
require("dotenv").config();
// Initialize Packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const gs = require("./google");

// Initialize App
const app = express();

// Set App
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Mongoose connection
mongoose.connect(`mongodb+srv://dgarci23:${process.env.DB_PASSWORD}@cluster0.vovxs.mongodb.net/clientManagementDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

// Mongoose schema and model
const userSchema = new mongoose.Schema({
    
    user: String,
    password: String,
    privilege: String,
    branch: String

});

const clientSchema = new mongoose.Schema({
    name: String,
    timestamp: Date,
    doc_id: String,
    phone: String,
    type: String,
    branch: String,
    user: String,
});


const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {

    res.render("login");

});

app.post('/', (req, res) => {

    const user = req.body.user;
    const password = req.body.password;

    User.findOne({user: user}, (err, userFound)=>{

        if (!err) {
            if (userFound) {

                bcrypt.compare(password, userFound.password, (err, check) => {
    
                    if (check) {
                        res.render("clients", {user: user});
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

app.post('/new', (req, res) => {

    gs.gswriteclient().then((data) => {


        const user = {
            name: data[1],
            timestamp: data[0],
            doc_id: data[2],
            phone: data[3],
            type: data[4],
            branch: data[42],
            user: req.params.user
        }

        res.render("clients", {user: user});

    });

})


// Listening on port
app.listen(3000, () => console.log("Listening on port 3000."));