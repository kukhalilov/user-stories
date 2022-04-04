const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");
const pug = require("pug");
const passport = require("passport");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')
const app = express();
app.locals.moment = require('moment');

const PORT = process.env.PORT || 3000;

// Load config
dotenv.config({ path: "./config/config.env" });

// Set view engine
app.set('views', __dirname + '/views');
app.set("view engine", "pug");

app.use(express.urlencoded({extended: false}))

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
  })
);

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Console logging methods, requests ...
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.listen(PORT, (err) => {
  if (err) throw err;

  console.log(`Server running on port ${PORT}`);
});
