const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Load User Model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ username: "username" }, (username, password, done) => {
      //   Match User
      User.findOne({
        username: username,
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: "Invalid Username" });
        }
        console.log("Checking password");
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
