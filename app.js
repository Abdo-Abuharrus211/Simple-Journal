const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
// const temps = require(__dirname + "temps");

/// Consts & Var declarations
const homeStartingContent = "A journal of a Lonely 4 that can cook.";
const aboutContent = "I'm just a guy trying to find himself in life, struggling through but somehow managing to survive in this cold world.I find that writing about life, the things I'm dealing with and feeling, helps cope with them. It relieves some of the pressure that builds up from having no one to talk to. It quite literally keeps me alive...";
const contactContent = "Hey there, if you'd like to contact me, feel free to send me an email at ...";
//array to store user posts
let posts = [];


const app = express();

app.set('view engine', 'ejs');
////////////////////////////////
// EXPRESS' built-in body parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//////// Get methods for individiual pages:

app.get("/", function(req, res) {
  res.render("home", {
    homeStartingContent,
    posts: posts
  });
})

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

////Post methods for individiual pages:


//post method to store user input when composing a post
app.post("/compose", function(req, res) {
  const newPost = {
    TITLE: req.body.postTitle,
    CONTENT: req.body.postContent
  };
  posts.push(newPost);
  res.redirect("/")
});

//Express routing for retreiving posts & rendering a seperate page for them!
app.get("/posts/:postName", function(req, res) {
  //lowerCase method from the Lodash library
  const reqTitle = _.lowerCase(req.params.postName);
  posts.forEach(function(post) {
    const storedTitle = _.lowerCase(post.TITLE);
    if (reqTitle === storedTitle) {
      res.render("post", {
        thisPost: post});
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
