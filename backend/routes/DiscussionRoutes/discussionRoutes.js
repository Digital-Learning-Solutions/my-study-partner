// backend/routes/api.js
import express from "express";
import * as DiscussionCtrl from "../../controllers/DiscussionController/discussionController.js";
import Discussion from "../../models/DiscussionModel/Discussion.js";

const router = express.Router();

router.get("/sections", DiscussionCtrl.getSections);
router.get("/discussions", DiscussionCtrl.listDiscussions);
router.get("/discussions/:id", DiscussionCtrl.getDiscussion);
router.post("/discussions", DiscussionCtrl.createDiscussion);
router.post("/discussions/:id/answers", DiscussionCtrl.addAnswer);

router.post("/enroll/toggle", DiscussionCtrl.toggleEnroll);
router.get("/enroll", DiscussionCtrl.getUserEnrollments);

// ------------------------------
// 🟦 Answer-level actions
// ------------------------------

router.post(
  "/discussions/:id/answers/:answerId/upvote",
  DiscussionCtrl.handleAnswerUpvote
);
router.post(
  "/discussions/:id/answers/:answerId/downvote",
  DiscussionCtrl.handleAnswerDownvote
);
router.post(
  "/discussions/:id/answers/:answerId/report",
  DiscussionCtrl.handleAnswerReport
);

// ------------------------------
// 🔹 Upvote a Discussion
// ------------------------------
router.post("/discussions/:id/upvote", DiscussionCtrl.handleQuestionUpvote);

// ------------------------------
// 🔹 Downvote a Discussion
// ------------------------------
router.post("/discussions/:id/downvote", DiscussionCtrl.handleQuestionUpvote);

// ------------------------------
// 🔹 Report a Discussion
// ------------------------------
router.post("/discussions/:id/report", DiscussionCtrl.handleQuestionUpvote);

export default router;
