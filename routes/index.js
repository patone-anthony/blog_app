const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");

const Post = require("../models/Post");
// const User = require("../models/User");

//@desc   Homepage (all public stories)
// @route   Get /
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user").sort({ createdAt: "desc" }).lean();
    res.render("home", {
      posts,
    });
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

module.exports = router;
