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
const MongoStore = require("connect-mongo");

// Initialize App
const app = express();

// Set App
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session setup for Passport Use
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://dgarci23:${process.env.DB_PASSWORD}@cluster0.vovxs.mongodb.net/clientManagementDB?retryWrites=true&w=majority`
    }),
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
    branch: String,
    clients: [Object],
    mainClient: Object
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
                    timestamp: data[0].toString(),
                    doc_id: data[2],
                    phone: data[3],
                    type: data[4],
                    branch: data[42],
                    user: req.user.username
                });

                User.findById(req.user.id, (err, foundUser) => {

                    if (foundUser.mainClient !== null) {

                        while (foundUser.clients.length > 7) {
                            foundUser.clients.shift();
                        }
    
                        foundUser.clients.push(foundUser.mainClient);
                    }

                    foundUser.mainClient = client;

                    foundUser.save();

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
});

app.get("/user", (req, res) => {

    if (req.isAuthenticated()) {

        const id = req.user.id;

        User.findById(id, (err, userFound) => {

            if (err) {
                console.log(err);
            } else {
                const clientInfo = {
                    mainClient: userFound.mainClient,
                    clients: userFound.clients
                };

                res.send(clientInfo);
            }

        })

    } else {
        res.redirect("/");
    }
});

app.get("/user/:user", (req, res) => {

    if (req.isAuthenticated()) {

        const username = req.params.user;

        User.findOne({username: username}, (err, userFound) => {
            if (err) {
                console.log(err);
            } else {

                res.send(userFound);

            }
        })

    } else {
        res.redirect("/");
    }

})

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

app.get("/admin", (req, res) => {
    if (req.isAuthenticated()) {

        User.find({privilege: "User"}, (err, usersFound) => {


            // console.log(usersFound);

            res.render("admin", {users: usersFound});

        });


    } else {

        res.redirect("/");
    }
});

app.get('/admin/users', (req, res) => {
    
    if (req.isAuthenticated()) {

        User.find({privilege: "User"}, (err, usersFound) => {

            res.render("admin-users", {users: usersFound});
        });

    } else {
        res.redirect("/");
    }

});

app.get("/admin/add", (req, res) => {
    
    if (req.isAuthenticated()) {
        res.render("admin-add");
    }

});


// POST
app.post('/', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = new User({
        username: username,
        password: password
    });

    let route = "/clients";

    User.findOne({username: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.privilege === "Admin") {
                    route = "/admin";
                }
            }
        }

        req.login(user, (err) => {
    
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local", {successRedirect: route, failureRedirect: "/"})(req, res);
            }
    
        });
    });


});

app.post("/admin/add", (req, res)=>{


    User.register({username: req.body.username}, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            User.updateOne({username: req.body.username}, {branch: req.body.branch, privilege: req.body.privilege}, (err)=>{
                if (err) {
                    console.log(err);
                } else {
                    res.render("admin");
                }
            });
        }
    });


});

// Listening on port
app.listen(process.env.PORT || 3000, () => console.log("Listening on port 3000."));