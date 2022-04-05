const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
router.post(
  "/",
  ensureAuth,

  [
    check("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 characters long"),
    check("storyBody")
      .trim()
      .isLength({ min: 30 })
      .withMessage("Must be at least 30 characters long"),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      req.body.user = req.user.id;
      let title = req.body.title;
      let storyBody = req.body.storyBody;
      if (!errors.isEmpty()) {
        console.log(errors);
        res.render("add", {
          errors: errors.array(),
          formData: {
            title: title,
            storyBody: storyBody,
          },
        });
      } else {
        await Story.create(req.body);
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
);

// Show stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate('user')
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
