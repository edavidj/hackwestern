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
userPersonality = "123"; 
var reviewText;
var highest;
var keys;
personality = "1234";
var valueHash;

var response = function(res) {  // valueArray =[res.openness, res.extraversion, res.agreeableness, res.conscientiousness]; 
               valueHash = {"openness": res.openness, "extraversion": res.extraversion, "agreeableness": res.agreeableness, "conscientiousness": res.conscientiousness};
               keys = Object.keys(valueHash).sort().reverse();
               for (var i = 0 in keys){
                  personality = keys[i];
                  return personality;
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
            .then((personality)=> {
                mongoose.connection.db.collection('users').update(
            {'user_id': userObj.user_id},
            {
                $set: {'personality': personality }
            }
        );

            })
            .catch(logError);
        });

        console.log(personality);

             }
); 

        //getting the business data code 

//query to get personality type of current user 
 mongoose.connection.db.collection("users").findOne({'user_id': userObj.user_id}, function(err, documents){
    console.log(documents.personality);

    //putting it in the var 
    userPersonality = documents.personality; 

    //query to get user_ids of users with matching personalities to current user 
  mongoose.connection.db.collection("users").find({'personality': userPersonality}).toArray((err, documents) => {
    console.log(documents);
    console.log(userPersonality);


        //find review_ids of each userId
        documents.forEach(function(value){
            console.log(value.user_id); 
            console.log(value.name); 

            mongoose.connection.db.collection("reviews").find({'user_id': value.user_id}).toArray((err, documents) => {
                    
                    documents.forEach(function(value){
                        console.log(value.business_id);
                        console.log(value.text); 

                        mongoose.connection.db.collection("businesses").find({'business_id': value.business_id}).toArray((err, documents) => {

                                documents.forEach(function(value){
                                    console.log(value.name); 
                                });
                        });

                    });

   });

        });


}
); 
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