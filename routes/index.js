var express = require("express");
var router = express.Router();
var User = require("../models/user.js");
var passport = require("passport");
var middleware = require("../middleware/index");

//  Root Route
router.get("/", function(req, res) {
    res.render("landing");
});


// ======================
//  AUTH ROUTES
// ======================

//  Show Register Form
router.get("/register", function(req, res) {
    res.render("register");
});

//handle Sign Up Logic
router.post("/register", function(req, res) {
   User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
       if (err) {
           return res.render("register", {"error": err.message});
       }
       passport.authenticate("local")(req, res, function() {
           req.flash("Welcome to YelpCamp" + user.username);
          res.redirect("/campgrounds"); 
       });
   });
});

//  Show Login Form
router.get("/login", function(req, res) {
    res.render("login");
});

//  handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) {
});

//  Logout logic
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "You've been logged out successfully.");
   res.redirect("/campgrounds");
});


module.exports = router;