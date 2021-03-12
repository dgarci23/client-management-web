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
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session setup for Passport Use
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
// User collection setup with Mongoose
const userSchema = new mongoose.Schema({
    
    username: String,
    password: String,
    privilege: String,
    branch: String

});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

// Passport Strategy and Serializing
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Client collection setup with Mongoose
const clientSchema = new mongoose.Schema({
    name: String,
    timestamp: Date,
    doc_id: String,
    phone: String,
    type: String,
    branch: String,
    user: String,
});
const Client = mongoose.model("Client", clientSchema);


// Routes
// GET
app.get('/', (req, res) => {

    res.render("login");

});

app.get("/clients", (req, res) => {
    if (req.isAuthenticated()) {
        
        res.render("clients");
        
    } else {
        res.redirect("/");
    }
});

app.get('/new', (req, res) => {
    
    if (req.isAuthenticated()) {
        gs.gswriteclient().then((data) => {
            
            
            if (data) {
                const client = new Client({
                    name: data[1],
                    timestamp: String(data[0]),
                    doc_id: data[2],
                    phone: data[3],
                    type: data[4],
                    branch: data[42],
                    user: req.user.username
                });
                
                client.save();
                
                res.send(client);
                
            } else {
                res.sendStatus(404);
            }
        });
    } else {
        res.redirect("/");
    }
})

// POST
app.post('/', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username: username,
        password: password
    });

    req.login(user, (err) => {

        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, ()=> {

                res.redirect("/clients");
            })
        }

    });
});

// Listening on port
app.listen(3000 || process.env.PORT, () => console.log("Listening on port 3000."));