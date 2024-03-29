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
// Main route - login and then main page depending on privilege
app.get('/', (req, res) => {

    res.render("login");

});

// Main page for privilege: User
// Allows for users to see their clients information
app.get("/clients", (req, res) => {
    if (req.isAuthenticated()) {
        
        res.render("clients");
        
    } else {
        res.redirect("/");
    }
});

// Main page for privilege: Admin
// Allows admin to check on users, add new users and track clients
app.get("/admin", (req, res) => {

    
    if (req.isAuthenticated()) {


        checkPrivilegeAdmin(req.user.username).then((access)=>{

            if (access) {
                User.find({privilege: "User"}, (err, usersFound) => {
                    
                    res.render("admin");
                    
                });
            } else {
                res.redirect("/");
            }
        })

    } else {

        console.log("no auth");

        res.redirect("/");
    }
});

// Adds new client to the /clients view for a user
// GoogleSheets coordination
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

// Gets the user information - main client and side clients
// Fetch when DOM loaded in /clients
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

// Gets the user information
// Does not requested current user to be in session
app.get("/user/:user", (req, res) => {

    if (req.isAuthenticated()) {

        checkPrivilegeAdmin(req.user.username).then((access)=>{
            if (access) {
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

    } else {
        res.redirect("/");
    }
    
})

// Logs out of the session
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

// Admin view - Gets the information on the users and their activity
app.get('/admin/users', (req, res) => {
    
    if (req.isAuthenticated()) {

        checkPrivilegeAdmin(req.user.username).then((access)=>{
            if (access){
                User.find({privilege: "User"}, (err, usersFound) => {

                    res.render("admin-users", {users: usersFound});
                });
            } else {
                res.redirect("/");
            }
        });

    } else {
        res.redirect("/");
    }

});

// Admin view - Adds new users to the database
app.get("/admin/add", (req, res) => {
    
    if (req.isAuthenticated()) {
        
        checkPrivilegeAdmin(req.user.username).then((access)=>{
            if (access) {
                res.render("admin-add");
            } else {
                res.redirect("/");
            }
        });

    } else {
        res.render("/");
    }
});

// Admin view - Search for clients in the database
app.get('/admin/search', (req, res) => {

    res.render("admin-search");

});


// POST
// Logs in the user and checks the privilege - redirects accordingly
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

// Post request for new user
app.post("/admin/add", (req, res)=>{
    
    if (req.isAuthenticated()) {
        checkPrivilegeAdmin(req.user.username).then((access)=>{
            if (access) {
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
            } else {
                res.redirect("/");
            }
        })
    }
});

// Post request for client in the DB
app.use(express.json());
app.post('/admin/search', (req, res)=> {

    if (req.isAuthenticated()) {
        checkPrivilegeAdmin(req.user.username).then((access) => {
            if (access) {
                Client.find({$or: [{name: {$regex: new RegExp(req.body.criteria, 'i')}}, {phone: {$regex: new RegExp(req.body.criteria, 'i')}}]}, (err, clientsFound)=>{

                    res.send({clients: clientsFound});
                
                });
            } else {
                res.redirect("/");
            }
        })
    } else {
        res.redirect("/");
    }
});

// LISTENING
// Listening on port
app.listen(process.env.PORT || 3000, () => console.log("Listening on port 3000."));


// FUNCTIONS
// Auth functions
async function checkPrivilegeAdmin(username) {
    
    let access;
    
    return User.findOne({username: username}).exec().then(userFound => {
        access = userFound && userFound.privilege === "Admin" ? true : false;
        return access;
    });
}
