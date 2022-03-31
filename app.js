const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const path = require("path");
const pug = require("pug");
const passport = require("passport");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 3000;

// Load config
dotenv.config({ path: "./config/config.env" });

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

// Set view engine
app.set("view engine", "pug");

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

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
