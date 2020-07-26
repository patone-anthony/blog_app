const path = require("path");
const express = require("express");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const flash = require("express-flash");

// Load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Passport Config
require("./config/passport")(passport);

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebar Helpers
const { formatDate } = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("secretKey", "nodeRestApi");
app.set("view engine", ".hbs");
app.use(flash());

// config express-session
var sess = {
  secret: "CHANGE THIS TO A RANDOM SECRET",
  cookie: { _expires: 24 * 60 * 60 * 1000 /* 24 hours*/ },
  resave: false,
  saveUninitialized: true,
};

if (app.get("env") === "production") {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;
}

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Passport Middleware
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/posts", require("./routes/posts"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
