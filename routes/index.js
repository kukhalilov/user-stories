const express = require("express");
const router = express.Router();

// Middlewafre functions to prevent bypassing auth and showing login page after logging in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}
function ensureGuest(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    return next();
  }
}

// Login page
router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

// Dashboard page
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard");
});

module.exports = router;
