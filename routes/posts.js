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

// @desc    Add Post
// @route   GET /posts/add
router.get("/new", ensureAuthenticated, (req, res) => {
  res.render("posts/new");
});

//@desc   User's posts
// @route   Get /posts/:username
router.get("/:username", ensureAuthenticated, async (req, res) => {
  try {
    let posts = await Post.find({ user: req.user._id }).sort({ createdAt: "descending" }).lean();
    res.render("posts/user", {
      posts,
    });
  } catch (err) {
    console.error(err);
    res.render("error/error");
  }
});

//@desc   Edit posts
// @route   Get /posts/:id
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user").lean();

    if (!post) {
      return res.render("error/error");
    }

    if (post.user._id.toString() != req.user._id.toString()) {
      return res.redirect("posts");
    } else {
      return res.render("posts/edit", {
        post,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render("error/error");
  }
});

//@desc   Update post
// @route   PUT /posts/:id
router.put("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).populate("user").lean();

    if (!post) {
      return res.render("error/error");
    }

    if (post.user._id.toString() != req.user._id.toString()) {
      return res.redirect("posts");
    } else {
      post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/posts/" + req.user.username);
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
    const post = await Post.findById(req.params.id).populate("user").lean();
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

// @desc    Delete post
// @route   DELETE /post/:id
router.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id).lean();
    console.log(post);
    if (!post) {
      return res.render("error/error");
    }

    if (post.user._id.toString() != req.user._id.toString()) {
      console.log(`${post.user._id}  {req.user._id}`);
      res.redirect("/posts/" + req.user.username);
    } else {
      await Post.remove({ _id: req.params.id });
      req.flash("success_msg", "Post deleted");
      res.redirect("/posts/" + req.user.username);
    }
  } catch (err) {
    console.error(err);
    return res.render("error/error");
  }
});

module.exports = router;
