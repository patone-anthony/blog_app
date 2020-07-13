const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

const Post = require("../models/Post");

// @desc    User's posts
// @route   POST /
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Post.create(req.body);
    res.redirect("/posts/" + req.user.username);
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

// @desc    User's posts
// @route   POST /
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    req.body.user = req.user._id;
    await Post.create(req.body);
    res.redirect("/posts/" + req.user.username);
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

// @desc    Add Post
// @route   GET /posts/add
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("posts/new");
});

//@desc   User's posts
// @route   Get /posts/:username
router.get("/:username", ensureAuthenticated, async (req, res) => {
  try {
    let posts = await Post.find({ username: req.body.username }).lean();
    res.render("myposts", {
      username: req.user.username,
      posts: "Test post",
    });
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

//@desc   Edit posts
// @route   Get /posts/:username
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    let post = await Post.findById(req.params._id).lean();
    res.render("posts/edit", {
      post,
    });
    if (!post) {
      return res.render("error/error");
    }

    if (post.user != req.user.id) {
      res.redirect("/myposts");
    } else {
      res.render("posts/edit", {
        post,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/error");
  }
});

//@desc   Post  detail
// @route   Get /posts/:username
router.get("/detail/:id", async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).populate("user").lean();
    console.log(post);

    if (!post) {
      return res.render("error/error");
    } else {
      res.render("posts/detail", {
        post,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/error");
  }
});

module.exports = router;
