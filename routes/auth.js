// const express = require("express");
// const router = express.Router();
// const { ensureAuth, ensureGuest } = require("../middleware/auth");

// const Post = require("../models/Posts");

// //@desc   Login/Landing page
// // @route   Get /
// router.get("/", ensureGuest, (req, res) => {
//   res.render("login", {
//     layout: "login",
//   });
// });

// //@desc   Dashboard
// // @route   Get /dashboard
// router.get("/", ensureAuth, async (req, res) => {
//   try {
//     const stories = await Post.find({ user: req.user.id }).lean();
//     res.render("myposts", {
//       name: req.user.username,
//       Posts,
//     });
//   } catch (err) {
//     console.error(err);
//     res.render("error/error");
//   }
// });

// module.exports = router;
