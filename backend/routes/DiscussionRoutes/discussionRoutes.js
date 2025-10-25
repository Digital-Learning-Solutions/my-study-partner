// backend/routes/api.js
import express from "express";
import { sections } from "../../data/sections.js";
import * as DiscussionCtrl from "../../controllers/DiscussionController/discussionController.js";

const router = express.Router();

router.get("/sections", DiscussionCtrl.getSections(sections));
router.get("/discussions", DiscussionCtrl.listDiscussions);
router.get("/discussions/:id", DiscussionCtrl.getDiscussion);
router.post("/discussions", DiscussionCtrl.createDiscussion);
router.post("/discussions/:id/answers", DiscussionCtrl.addAnswer);

router.post("/enroll/toggle", DiscussionCtrl.toggleEnroll);
router.get("/enroll", DiscussionCtrl.getUserEnrollments);

import Discussion from "../../models/DiscussionModel/Discussion.js";

// ------------------------------
// 🔹 Upvote a Discussion
// ------------------------------
router.post("/discussions/:id/upvote", async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ id: req.params.id });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.upvotes = (discussion.upvotes || 0) + 1;
    // Optional: Prevent infinite voting if you track userId in future
    console.log("Upvoted");

    await discussion.save();
    res
      .status(200)
      .json({ message: "Upvoted successfully", upvotes: discussion.upvotes });
  } catch (err) {
    console.error("Error in upvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------
// 🔹 Downvote a Discussion
// ------------------------------
router.post("/discussions/:id/downvote", async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ id: req.params.id });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.downvotes = (discussion.downvotes || 0) + 1;
    await discussion.save();

    res.status(200).json({
      message: "Downvoted successfully",
      downvotes: discussion.downvotes,
    });
  } catch (err) {
    console.error("Error in downvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------
// 🔹 Report a Discussion
// ------------------------------
router.post("/discussions/:id/report", async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ id: req.params.id });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.report_count = (discussion.report_count || 0) + 1;
    await discussion.save();

    res.status(200).json({
      message: "Reported successfully",
      report_count: discussion.report_count,
    });
  } catch (err) {
    console.error("Error in report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
