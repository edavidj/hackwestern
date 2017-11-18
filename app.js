var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    config      = require("./config"),
    User        = require("./models/User"),
    users       = require("./models/Users"),
    businesses  = require("./models/Businesses"),
    reviews     = require("./models/Reviews"),
    flash       = require("connect-flash"), 
    app         = express();

//var indico = require('indico.io');
//indico.apiKey =  '45f6807fe76a898415348e045a2d9c49';

//var response = function(res) { console.log(res); }
//var logError = function(err) { console.log(err); }

mongoose.connect(config.db, {useMongoClient:true});

/* single example
indico.emotion("The food in this restaurant sucks. I would never come back.")
  .then(response)
  .catch(logError);
*/

app.get('/users', function(req, res){
    mongoose.model('users').find(function (err, users) {
        res.send(users);
}); 
});


app.get('/businesses', function(req, res){
    mongoose.model('businesses').find(function (err, businesses) {
        res.send(businesses); 
    });
});

app.get('/reviews', function(req, res){
    mongoose.model('reviews').find(function (err, reviews) {
        res.send(reviews); 
    });
});
app.use(flash());
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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
    // successRedirect: "/user/",
    // successFlash: "Welcome back!",
    failureRedirect: "/login",
    failureFlash: "Incorrect login credentials."
}), function(req,res){
    //do nothing for now
    req.flash("success", "Welcome back, "+req.user.username);
    res.redirect("/user/"+req.user.username);
});
app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message); 
            res.redirect("back");
            return;
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome, "+user.username);
            console.log("Success");
            res.redirect("/");
        });
    });
});
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});
//======= USER ROUTES =========
app.get("/user/:id", isLoggedIn, function(req,res){
    //render user page here
    res.render("account"); 
});
//====== MIDDLEWARE ====== 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}
app.listen(3000, function(err){
    if(err) throw err;
    console.log("Connected to server.");    
});