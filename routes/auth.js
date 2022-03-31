const express = require("express");
const router = express.Router();
const passport = require("passport");

// Authentication with Google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// Google authentication callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
