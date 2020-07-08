const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

const Post = require("../models/Post");

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

module.exports = router;
