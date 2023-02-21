const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');
require("dotenv").config();
//const { request } = require("express");

const homeStartingContent = "The daily blog project is an initiative aimed at encouraging individuals to cultivate a daily writing habit by sharing their thoughts, experiences, and insights through a blog. The project emphasizes the benefits of regular writing, including improved communication skills, enhanced creativity, and better self-expression. Through the daily blog project, participants can connect with a broader community of writers, receive feedback, and gain exposure to diverse perspectives and ideas. By committing to writing daily, individuals can hone their writing skills, overcome writer's block, and develop a greater sense of self-awareness. The daily blog project is a fantastic way to explore one's interests, share knowledge, and build an online presence.";

const app = express();

//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(process.env.Mongodb_link, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
 };

const Post = mongoose.model("Post", postSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      css: "styles.css",
      title: post.title,
      content: post.content
    });
 
  });
});

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      css: "styles.css",
      homeStartingContent: homeStartingContent,
      posts: posts
      });
  })
});

app.get("/about", function(req, res){
  res.render('about',{css : "styles.css"});
});

app.get("/contact", function(req, res){
  res.render('contact',{css : "contact.css"});
});

app.get("/compose", function(req, res){
  res.render('compose',{css : "styles.css"});
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
