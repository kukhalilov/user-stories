const express = require("express");
const router = express.Router();

const Story = require("../models/Story");

// Middlewafre
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
  }
}

// Add page
router.get("/add", ensureAuth, (req, res) => {
  res.render("add");
});

// Form manipulation
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render('error/500')
  }
});

module.exports = router;
