// dotenv config
require("dotenv").config();
// Initialize Packages
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const gs = require("./google");

// Initialize App
const app = express();

// Set App
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mongoose connection
mongoose.connect(`mongodb+srv://dgarci23:${process.env.DB_PASSWORD}@cluster0.vovxs.mongodb.net/clientManagementDB?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

// Mongoose schema and model
const userSchema = new mongoose.Schema({
    
    username: String,
    password: String,
    privilege: String,
    branch: String

});

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

User.register({username: "egdomonte"}, "Password", (err, user) => {

});