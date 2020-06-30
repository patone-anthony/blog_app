const express = require("express");
const router = express.Router();
// const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Post = require("../models/Post");

//@desc   Homepage (all public stories)
// @route   Get /
router.get("/", (req, res) => {
  res.render("home");
});

//@desc   My posts
// @route   Get /myposts
router.get(
  "/myposts",
  /*ensureAuth, */ async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).lean();
      res.render("myposts", {
        name: req.user.username,
        posts,
      });
    } catch (err) {
      console.error(err);
      res.render("error/error");
    }
  }
);

module.exports = router;
