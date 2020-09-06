var bodyParser = require("body-parser"),
express = require("express"),
app = express(),
mongoose = require("mongoose"),
passport = require("passport"),
User = require("./models/user.js"),
LocalStrategy = require("passport-local"),
flash = require("connect-flash");



mongoose.connect("mongodb://localhost:27017/se", {
  useNewUrlParser: true,
  'useUnifiedTopology': true
});
mongoose.set('useFindAndModify', false);

var connection = mongoose.connection;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(flash());

app.use(require("express-session")({
    secret: "jaikumxr",
    resave: false,
    saveUninitialized: false
}));


app.get("/", function(req, res){
    res.redirect("/home");
})

app.get("/home", isLoggedIn, function(req, res){
    res.render("home",{
        currentUser = req.user
    });
})

var newUser = {"username":"admin","isAdmin":true,"email":"jai@example.com"};
var password = "admin";

User.register(newUser, password, function(err,user){
  if(err){
    console.log(err);
  }
});


//show login form
app.get("/login", function(req, res) {
    res.render("login");
  });
  
  //handling login logic
  app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
  }), function() {});
  
  //logout ROUTE
  app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged out");
    res.redirect("/login");
  });

  //isloggedin
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please log in first")
    res.redirect("/login");
  }
  

app.listen(3000,function(){
  console.log("sv is up");
});