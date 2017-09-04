var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    Campground = require("./models/campground.js"),             //Campground Schema Setup
    Comment = require("./models/comment.js"),                   //Comment Schema Setup
    User = require("./models/user.js"),                         //User Schema Setup
    seedDB = require("./seeds.js");
    
var campgroundRoutes = require("./routes/campgrounds.js"),
    commentRoutes = require("./routes/comments.js"),
    indexRoutes = require("./routes/index.js");

//mongoose.connect("mongodb://localhost/yelp_camp_v13", {useMongoClient: true});
mongoose.connect("mongodb://jayant:Jayantthegr8@ds123614.mlab.com:23614/yelpcampdatabase");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());
app.locals.moment = require("moment");
//seedDB();

//  PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});


//  ROUTES
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Started!");
});