var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    localStrategy = require("passport-local"),
    config      = require("./config"),
    users       = require("./models/Users"),
    businesses  = require("./models/Businesses"),
    reviews     = require("./models/Reviews"),
    flash       = require("connect-flash"), 
    app         = express();

// Indico API
var indico = require('indico.io');
indico.apiKey =  '45f6807fe76a898415348e045a2d9c49';
mongoose.connect(config.db, {useMongoClient:true});

var userObj; 
var userID; 
var reviewText;
var highest;
var keys;
var personality;
var valueHash;

var response = function(res) {  // valueArray =[res.openness, res.extraversion, res.agreeableness, res.conscientiousness]; 
               valueHash = {"openness": res.openness, "extraversion": res.extraversion, "agreeableness": res.agreeableness, "conscientiousness": res.conscientiousness};
               keys = Object.keys(valueHash).sort().reverse();
               for (var i = 0 in keys){
                  personality = keys[i];
                  console.log(keys[i]);
                  return;
               }
                    //personality = v;
                    //highest = valueHash[v];
                    //console.log(personality); 
                   // return;
            };

var logError = function(err) { console.log(err); }

mongoose.connect(config.db, {useMongoClient:true});

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
app.use(require("express-session")({
    secret: "i want chips",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})); //parse form and query variables better
app.set("view engine", "ejs");

app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});   
//for ref to front end files /<folder>/<file>
//RENDER ROUTES
app.get("/", function(req,res){
    res.render("landing");
});
app.post("/search", function(req,res){
    users.find({name: req.body.username}, function(err, user){
        if(err){
            console.log(err);
            return;
        }

        userObj = user[0]; 
        //queries here 


        mongoose.connection.db.collection("reviews").find({'user_id': userObj.user_id}).toArray((err, documents) => {
    
        documents.forEach(function(value){

            console.log(value.text);
            reviewText = value.text; 

            indico.personality(reviewText)
            .then(response)
            .catch(logError);

            console.log(personality);
        });

        //console.log(personality);
    }
); 
        res.render("account", {user: userObj});
    })
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