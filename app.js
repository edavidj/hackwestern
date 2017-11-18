var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    config      = require("./config"),
    User        = require("./models/User"),
    app         = express();

mongoose.connect(config.db, {useMongoClient:true});
// ==== mongo example ====
// var testSchema = mongoose.Schema({ //define schema properties
//     text: String
// });
// var Test = mongoose.model("Test", testSchema); //create model

// Test.create({ //example use case
//     test: "test"
// }, function(err, test){
//     if(err) throw err;
//     console.log("Success");
// })
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})); //parse form and query variables better
app.set("view engine", "ejs");
// ========= PASSPORT INIT ============
app.use(require("express-session")({
    secret: "i want chips",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
});   
//for ref to front end files /<folder>/<file>
//RENDER ROUTES
app.get("/", function(req,res){
    res.render("landing");
});
//======= AUTH ========
app.get("/login", function(req,res){
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    // successFlash: "Welcome back!",
    failureRedirect: "/login"
    // failureFlash: "Incorrect login credentials."
}), function(req,res){
    //do nothing for now
});
app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // req.flash("error", err.message); TODO: add flash msgs once this works
            res.redirect("back");
            return;
        }
        passport.authenticate("local")(req,res,function(){
            // req.flash("success", "Welcome to my blog "+user.username);
            console.log("Success");
            res.redirect("/");
        });
    });
});
//======= USER ROUTES =========
app.get("/account/:id", function(req,res){
    //render user page here
});

app.listen(3000, function(err){
    if(err) throw err;
    console.log("Connected to server.");    
});