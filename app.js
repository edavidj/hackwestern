var express     = require("express"),
    path        = require("path"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    config      = require("./config"),
    app         = express();

mongoose.connect(config.db, {useMongoClient:true});

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