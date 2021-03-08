// dotenv config
require("dotenv").config();
// Initialize Packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

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

bcrypt.hash("Password", 10, (err, hash) => {


    
    const newUser = new User({
        user: "dgarci23",
        password: hash,
        privilege: "Admin",
        branch: "Avenida B"
    });
    
    newUser.save();
});
