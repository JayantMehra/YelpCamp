var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var middleware = require("../middleware/index");
var geocoder = require('geocoder');

//  INDEX
router.get("/", function(req, res) {
    //Get all campgrounds from Database
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });
});

//  NEW
router.get("/new",  middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

//  CREATE
router.post("/",  middleware.isLoggedIn, function(req, res) {      //RESTful routing
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: name, image: image, description: description, price: price, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } 
            else {
            //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});

//  SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {     // Populating with comments!
       if (err) {
           console.log("Oops! Something went wrong!");
       } 
       else {
        console.log(foundCampground);
        res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//  EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, campground) {
            res.render("campgrounds/edit", {campground: campground});
        });
});

//  UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
      req.body.campground.description = req.sanitize(req.body.campground.description);
      geocoder.geocode(req.body.location, function (err, data) {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newData = {name: req.body.campground.name, image: req.body.campground.image, description: req.body.campground.description, price: req.body.campground.price, location: location, lat: lat, lng: lng};
            Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
      });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    req.body.campground.description = req.sanitize(req.body.campground.description);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/camgrounds/" + req.params.id);
        }
    });
});


//  DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           res.redirect("/campgrounds");
       }
       else {
           req.flash("success", "Campground deleted");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;