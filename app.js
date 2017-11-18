var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    config      = require("./config"),
    app         = express();

var indico = require('indico.io');
indico.apiKey =  '45f6807fe76a898415348e045a2d9c49';

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }

mongoose.connect(config.db, {useMongoClient:true});

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

/* single example
indico.emotion("The food in this restaurant sucks. I would never come back.")
  .then(response)
  .catch(logError);
*/


var users = mongoose.model('users', {name: String, user_id: String}); 

app.get('/users', function(req, res){
    mongoose.model('users').find(function (err, users) {
        res.send(users);
}); 
});

var businesses = mongoose.model('businesses', {
    business_id: String,
    full_address: String,
    open: Boolean,
    categories: [String],
    city: String,
    name: String,
    neighborhoods: [String],
    state: String,
    stars: Number,
    type: String});

app.get('/businesses', function(req, res){
    mongoose.model('businesses').find(function (err, businesses) {
        res.send(businesses); 
    });
});

var reviews = mongoose.model('reviews', {
    user_id: String,
    review_id: String ,
    stars: Number,
    text: String,
    business_id: String
});

app.get('/reviews', function(req, res){
    mongoose.model('reviews').find(function (err, reviews) {
        res.send(reviews); 
    });
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})); //parse form and query variables better
app.set("view engine", "ejs");
//for ref to front end files /<folder>/<file>
//RENDER ROUTES
app.get("/", function(req,res){
    res.render("landing");
});
app.get("/login", function(req,res){
    //login page here
});
app.get("/register", function(req,res){
    //register here
});
app.get("/account/:id", function(req,res){
    //render user page here
});

app.listen(3000, function(err){
    if(err) throw err;
    console.log("Connected to server.");    
});