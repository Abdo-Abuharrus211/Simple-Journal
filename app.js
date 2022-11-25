const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

let key = config.MY_API_KEY;
const app = express();
app.set('view engine', 'ejs');
////////////////////////////////
// EXPRESS' built-in body parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//connecting to our MongoDB Atlas cluster...
mongoose.connect(key+"journalDB", {
  useNewUrlParser: true
});

/// Consts & Var declarations
const homeStartingContent = "A journal of a Lonely 4 that can cook.";
const aboutContent = "I'm just a guy trying to find himself in life, struggling through but somehow managing to survive in this cold world.I find that writing about life, the things I'm dealing with and feeling, helps cope with them. It relieves some of the pressure that builds up from having no one to talk to. It quite literally keeps me alive...";
const contactContent = "Hey there, if you'd like to contact me, feel free to send me an email";

//Mongoose Schemas & Models
const postSchema = mongoose.Schema({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);


//////// Get methods for individiual pages:
app.get("/", function(req, res){
Post.find({}, function(err, foundPosts){
  if(!err){
    res.render("home", {
      homeStartingContent,
      posts: foundPosts
    });
  } else {
    console.log("Unable to retrieve posts.");
  }
});
});

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

/////////////////Post methods for individiual pages://////////////


//post method to store user input when composing a post
app.post("/compose", function(req, res) {
const post = new Post({
  title: req.body.postTitle,
  content: req.body.postContent
});
post.save(function(err){
  if(!err){
    res.redirect("/");
  }
});
});

//Express routing for retreiving posts & rendering a seperate page for them!
app.get("/posts/:postId", function(req, res) {
  //lowerCase method from the Lodash library
  const reqPostID = req.params.postId;
  Post.findOne({_id: reqPostID}, function(err, foundPost){
    res.render("post", {
      title: foundPost.title,
      content: foundPost.content
    });
  });
});

/* let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
} */

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started successfully.");
});
