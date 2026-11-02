const express = require("express");
const Feedback = require("./models/Feedback");
const createFeedbackRouter = require("./routes/feedback");

function createApp(feedbackModel = Feedback) {
  const app = express();

  app.use(express.json());
  app.use("/api/feedback", createFeedbackRouter(feedbackModel));

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) {
      return next(error);
    }

    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
      return res.status(400).json({ message: "Request body contains invalid JSON" });
    }

    if (error.type === "entity.too.large") {
      return res.status(413).json({ message: "Request body is too large" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}

module.exports = createApp;
