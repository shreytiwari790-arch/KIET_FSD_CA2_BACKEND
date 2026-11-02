const express = require("express");

const validStatuses = new Set(["Pending", "Reviewed"]);

function parsePositiveInteger(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function createFeedbackRouter(Feedback) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    const { studentName, courseName, message, rating } = req.body ?? {};

    if (
      typeof studentName !== "string" ||
      !studentName.trim() ||
      typeof courseName !== "string" ||
      !courseName.trim() ||
      typeof message !== "string" ||
      !message.trim() ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message:
          "studentName, courseName, and message are required; rating must be an integer from 1 to 5"
      });
    }

    try {
      const feedback = await Feedback.create({
        studentName: studentName.trim(),
        courseName: courseName.trim(),
        message: message.trim(),
        rating
      });

      return res.status(201).json(feedback);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/", async (req, res, next) => {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = parsePositiveInteger(req.query.limit, 10);

    if (page === null || limit === null) {
      return res.status(400).json({
        message: "page and limit must be positive integers"
      });
    }

    const skip = (page - 1) * limit;
    if (!Number.isSafeInteger(skip)) {
      return res.status(400).json({ message: "Requested page is too large" });
    }

    try {
      const [feedback, totalRecords] = await Promise.all([
        Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Feedback.countDocuments()
      ]);

      return res.json({
        feedback,
        currentPage: page,
        totalRecords
      });
    } catch (error) {
      return next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body ?? {};

    if (!/^[a-f\d]{24}$/i.test(id)) {
      return res.status(400).json({ message: "Feedback ID is invalid" });
    }

    if (!validStatuses.has(status)) {
      return res.status(400).json({
        message: "status must be either Pending or Reviewed"
      });
    }

    try {
      const feedback = await Feedback.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      return res.json(feedback);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}

module.exports = createFeedbackRouter;
