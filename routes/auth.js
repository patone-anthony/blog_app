const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { validationResult, check } = require("express-validator");

require("dotenv").config();

// @desc   Register page
// @route   GET /
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// @desc   Register a user
// @route   POST /
router.post(
  "/register",
  [
    // Validation
    check("username")
      .custom(async (value) => {
        let usernameCheck = await User.findOne({ username: value });
        if (usernameCheck !== null) {
          return Promise.reject();
        }
      })
      .withMessage("Username is already in use"),

    check("email")
      .custom(async (value) => {
        let emailCheck = await User.findOne({ email: value });
        if (emailCheck !== null) {
          return Promise.reject();
        }
      })
      .withMessage("Email is already in use"),

    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),

    check("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),
  ],

  async (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("auth/register", { errors: errors.array() });
    } else {
      let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });

      await user.save();
      req.flash("success_msg", "Account successfully created");
      res.redirect("/auth/login");
    }
  }
);

// @desc   Login page
// @route   GET /login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// @desc   Login
// @route   Post /login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

// @desc   Logout
// @route   GET /logout
router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/auth/login");
});

module.exports = router;
