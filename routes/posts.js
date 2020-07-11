const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

const Post = require("../models/Post");

// @desc    Add Post page
// @route   GET /posts/add
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("posts/new");
});

// @desc    Process add form
// @route   POST /stories
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    console.log(req.user.username);
    req.body.user = req.user.username;
    console.log(req.body);
    await Post.create(req.body);
    res.redirect("/posts/" + req.user.username);
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

//@desc   User's posts
// @route   Get /posts/:username
router.get("/:username", ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ username: req.body.username }).lean();
    res.render("myposts", {
      username: req.user.username,
      posts: "Test post",
    });
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

// @desc    Show add page
// @route   POST /posts/add
// router.post('/add', ensureAuthenticated, (req, res) => {
//   res.render('posts/add')
// })

module.exports = router;
