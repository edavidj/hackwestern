var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    config      = require("./config"),
    app         = express();

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
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true})); //parse form and query variables better
app.set("view engine", "ejs");
//for ref to front end files /<folder>/<file>
//RENDER ROUTES
app.get("/", function(req,res){
    res.render("landing");
});
//======= AUTH ========
app.get("/login", function(req,res){
    res.render("login");
});
app.get("/register", function(req,res){
    res.render("register");
});
//======= USER ROUTES =========
app.get("/account/:id", function(req,res){
    //render user page here
});

app.listen(3000, function(err){
    if(err) throw err;
    console.log("Connected to server.");    
});