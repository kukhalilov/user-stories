const express = require("express");
const router = express.Router();

const Story = require("../models/Story");

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
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
