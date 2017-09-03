var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware/index");


//  Comments New Form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
       } 
       else {
            res.render("comments/new", {campground: campground});    
       }
    });
});

//  Comment Create
router.post("/", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
      if (err) {
          console.log(err);
      } 
      else {
          Comment.create(req.body.comment, function(err, comment) {
              if (err) {
                  req.flash("error", "Something went wrong. Please try again later");
                  console.log(err);
              }
              else {
                  //Add username to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
    
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect("/campgrounds/" + campground._id);
              }
          });
      }
   });
});

//  Comment Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//  Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   req.body.comment.text = req.sanitize(req.body.comment.text);
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
       if (err) {
           res.redirect("back");
       }
       else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) ;
});

//  Delete
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;