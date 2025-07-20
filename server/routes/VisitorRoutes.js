// routes/VisitorRoutes.js
const express = require("express");
const VisitorCounter = require("../models/Visitor");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.route("/")
  .post(limiter, async (req, res) => {
    try {
      const counter = await VisitorCounter.findOneAndUpdate(
        { name: "visitors" },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
      res.json({ 
        success: true,
        count: counter.count 
      });
    } catch (err) {
      console.error("Error updating visitor count:", err);
      res.status(500).json({ 
        success: false,
        error: "Internal server error" 
      });
    }
  });

// Add a GET endpoint to fetch without incrementing
router.route("/count")
  .get(async (req, res) => {
    try {
      const counter = await VisitorCounter.findOne({ name: "visitors" });
      res.json({ 
        success: true,
        count: counter ? counter.count : 0
      });
    } catch (err) {
      console.error("Error getting visitor count:", err);
      res.status(500).json({ 
        success: false,
        error: "Internal server error" 
      });
    }
  });

module.exports = router;