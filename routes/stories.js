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
    check("body")
      .trim()
      .isLength({ min: 30 })
      .withMessage("Must be at least 30 characters long"),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      req.body.user = req.user.id;
      let title = req.body.title;
      let body = req.body.body;
      if (!errors.isEmpty()) {
        console.log(errors);
        res.render("add", {
          errors: errors.array(),
          formData: {
            title: title,
            body: body,
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
      .populate("user")
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

// Show single story
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    res.render("show", {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

// Story edit page
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    res.render("error/404");
  }

  res.render("edit", {
    story,
  });
});

// Update Story
router.put(
  "/:id",
  ensureAuth,

  [
    check("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Must be at least 5 characters long"),
    check("body")
      .trim()
      .isLength({ min: 30 })
      .withMessage("Must be at least 30 characters long"),
  ],

  async (req, res) => {
    try {
      let story = await Story.findById(req.params.id).lean();
      const errors = validationResult(req);
      let title = req.body.title;
      let body = req.body.body;
      let status = req.body.status;

      if (!story) {
        return res.render("error/404");
      }

      if (!errors.isEmpty()) {
        console.log(errors);

        res.render("edit", {
          story,
          errors: errors.array(),
          formData: {
            title: title,
            body: body,
            status: status
          },
        });

      } else {
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        });

        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err);
      res.render("error/500");
    }
  }
);

module.exports = router;
