var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js")

var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "By the Ocean", 
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Granite Hill", 
        image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    
];


/*
    Add new Campgrounds is inside remove campgrounds because
    remove takes time and the callback function is always
    called after remove() is finished.
*/
function seedDB() {
    //Remove the existing Campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log("Oops! Something went wrong!");
        }
        console.log("Campgrounds Removed!"); 
        //Add new campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
              if (err) {
                  console.log(err);
              } 
              else {
                  console.log("Added a Campground!");
                  Comment.create(
                      {
                          text: "The camp was amazing!",
                          author: "J. Mehra"
                           
                      }, 
                      function(err, comment) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created New Comment!");
                            }
                  });
              }
            });
        });
    });
}

module.exports = seedDB;  //Without the () becuase executed later!

