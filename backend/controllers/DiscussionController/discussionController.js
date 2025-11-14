// backend/controllers/discussionController.js
import Discussion from "../../models/DiscussionModel/Discussion.js";
import Section from "../../models/DiscussionModel/Section.js";
import UserEnrollment from "../../models/DiscussionModel/UserEnrollment.js";
import User from "../../models/UserModel/user.js";
import mongoose from "mongoose";
import { monitorHateSpeech } from "./hateSpeechMonitor.js";

let nextDiscussionId = null;
let nextAnswerId = null;

async function ensureCounters() {
  if (nextDiscussionId !== null) return;
  const last = await Discussion.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  nextDiscussionId = last ? last.id + 1 : 1;
  const lastAnswer = await Discussion.findOne(
    { "answers.0": { $exists: true } },
    { "answers.id": 1 }
  )
    .sort({ "answers.id": -1 })
    .lean();
  nextAnswerId = lastAnswer
    ? Math.max(...lastAnswer.answers.map((a) => a.id)) + 1
    : 1;
}

export const getSections = async (req, res) => {
  // returns static sections + counts / trending sample
  console.log("getSections called");

  try {
    const sections = await Section.find({}).lean();
    console.log("sections retrieved:", sections);

    const counts = await Discussion.aggregate([
      { $group: { _id: "$section", count: { $sum: 1 } } },
    ]);
    const map = {};
    counts.forEach((c) => (map[c._id] = c.count));
    const enriched = sections.map((s) => ({
      ...s,
      discussionCount: map[s.key] || 0,
    }));
    return res.json({ sections: enriched });
  } catch (err) {
    console.error("getSections error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listDiscussions = async (req, res) => {
  // supports: page, limit, section, tags (comma), q text search, sort=recent|popular|trending
  try {
    // robust numeric parsing with sensible defaults
    const page = Math.max(
      1,
      Number.isFinite(Number(req.query.page)) ? parseInt(req.query.page, 5) : 1
    );
    const limit = Math.min(
      50,
      Number.isFinite(Number(req.query.limit))
        ? parseInt(req.query.limit, 5)
        : 5
    );

    // Normalize section query: treat "null", "undefined" or empty as no-section
    let section = req.query.section;
    if (typeof section === "string") {
      const sTrim = section.trim();
      if (
        sTrim === "" ||
        sTrim.toLowerCase() === "null" ||
        sTrim.toLowerCase() === "undefined"
      ) {
        section = undefined;
      } else {
        section = sTrim;
      }
    }

    const tags = req.query.tags
      ? req.query.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const q = req.query.q;
    const sort = req.query.sort || "recent"; // recent, popular, trending

    const filter = {};
    if (section) filter.section = section;
    if (tags.length) filter.tags = { $in: tags };
    if (q) filter.$text = { $search: q }; // optionally create text index

    console.log(
      "listDiscussions filter:",
      filter,
      "page:",
      page,
      "limit:",
      limit,
      "sort:",
      sort
    );

    let sortObj = { createdAt: -1 };
    if (sort === "popular") {
      sortObj = { upvotes: -1, no_of_answers: -1, createdAt: -1 };
    } else if (sort === "trending") {
      // simple trending score: answers*2 + upvotes - report_count + recency factor
      sortObj = {
        /* we will compute score in aggregation */
      };
    }

    if (sort === "trending") {
      const pipeline = [
        { $match: filter },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ["$no_of_answers", 2] },
                "$upvotes",
                { $subtract: [0, "$report_count"] },
                {
                  $divide: [
                    { $subtract: [new Date(), "$createdAt"] },
                    1000 * 60 * 60 * 24,
                  ],
                }, // recency as days (smaller is better, negative effect)
              ],
            },
          },
        },
        { $sort: { trendingScore: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];
      const results = await Discussion.aggregate(pipeline);
      const total = await Discussion.countDocuments(filter);
      const totalPages = Math.max(1, Math.ceil(total / limit));
      return res.json({ data: results, page, limit, total, totalPages });
    }

    const docs = await Discussion.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Discussion.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return res.json({ data: docs, page, limit, total, totalPages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    await ensureCounters();
    const {
      section,
      title,
      question,
      tags = [],
      newTags = [],
      authorId,
      authorName,
      authorAvatar, // Add this
      email,
    } = req.body;

    console.log("createDiscussion called with:", req.body);
    // ✅ Validate required fields
    if (!section || !title || !question || !authorId) {
      return res.status(400).json({
        message: "section, title, question, and authorId are required",
      });
    }

    // monitorHateSpeech(question, email, authorName);

    // ✅ 1. Find or create section document
    let sectionDoc = await Section.findOne({ slug: section });
    if (!sectionDoc) {
      // Create a new section if not found
      sectionDoc = new Section({
        name: section,
        slug: section.toLowerCase().replace(/\s+/g, "-"),
        tags: [],
      });
    }

    // ✅ 2. Add new tags to section (avoid duplicates)
    const combinedTags = new Set([
      ...sectionDoc.tags,
      ...newTags.filter((t) => t.trim() !== ""),
    ]);
    sectionDoc.tags = Array.from(combinedTags);
    await sectionDoc.save();

    // ✅ 3. Create the new discussion
    const discussion = new Discussion({
      id: nextDiscussionId++,
      section,
      title,
      question,
      authorId,
      authorName,
      authorAvatar, // Add this
      tags,
    });
    await discussion.save();

    // ✅ 4. Update user's created discussions (only if valid ObjectId)
    let user = null;
    if (mongoose.Types.ObjectId.isValid(authorId)) {
      user = await User.findById(authorId);
      if (user) {
        user.createdDiscussions.push(discussion._id);
        await user.save();
      }
    }

    // ✅ 5. Respond with success
    return res.status(201).json({
      message: "Discussion created successfully",
      discussion,
      user: {
        _id: user?._id,
        username: user?.username,
        createdDiscussions: user?.createdDiscussions,
      },
      updatedSectionTags: sectionDoc.tags, // Optional: frontend can update its tag list
    });
  } catch (err) {
    console.error("❌ createDiscussion error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDiscussion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doc = await Discussion.findOne({ id })
      .populate("authorId", "profile.avatarUrl") // Add this if you have user references
      .lean();

    if (!doc) return res.status(404).json({ message: "Not found" });

    // Ensure consistent author data structure
    const discussion = {
      ...doc,
      authorAvatar: doc.authorAvatar || doc.authorId?.profile?.avatarUrl,
      authorName: doc.authorName || "Anonymous",
    };

    return res.json(discussion);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addAnswer = async (req, res) => {
  console.log("\n==================== ADD ANSWER REQUEST ====================");
  console.log("➡️ Received request to add answer");
  console.log("📌 Discussion ID (param):", req.params.id);
  console.log("📌 Payload:", req.body);

  try {
    await ensureCounters();
    console.log("🔧 ensureCounters() executed");

    const id = parseInt(req.params.id);
    console.log("📌 Parsed Discussion ID:", id);

    const {
      answer,
      authorId,
      authorName,
      authorAvatar,
      email,
      sectionKey,
      discussionId,
    } = req.body;

    // Validate input
    if (!answer || !authorId) {
      console.log("❌ Validation failed: answer or authorId missing");
      return res.status(400).json({ message: "answer and authorId required" });
    }

    // Monitor Hate Speech (Disabled)
    // console.log("🧪 Running hate speech monitor...");
    // monitorHateSpeech(...)

    console.log("🔍 Searching for Discussion and User...");

    // Parallel fetch (Discussion + User)
    const [doc, user] = await Promise.all([
      Discussion.findOne({ id }),
      User.findById(authorId).select("profile.avatarUrl").lean(),
    ]);

    if (!doc) {
      console.log("❌ Discussion not found for ID:", id);
      return res.status(404).json({ message: "Discussion not found" });
    } else {
      console.log("✔ Discussion found:", doc.title);
    }

    if (!user) {
      console.log("⚠️ User not found for ID:", authorId);
    } else {
      console.log("✔ User found. Avatar:", user?.profile?.avatarUrl);
    }

    console.log("🆔 Generating new answer ID...");
    console.log("Current nextAnswerId:", nextAnswerId);

    const newAnswer = {
      id: nextAnswerId++,
      answer,
      authorId,
      authorName: authorName || "Anonymous",
      authorAvatar: authorAvatar || user?.profile?.avatarUrl,
      createdAt: new Date(),
      report_count: 0,
      is_highlighted: false,
      upvotes: 0,
      downvotes: 0,
    };

    console.log("📝 New Answer object:", newAnswer);

    console.log(`📌 Pushing answer into discussion ID ${id}`);
    doc.answers.push(newAnswer);

    doc.no_of_answers = doc.answers.length;
    console.log("📊 Updated number of answers:", doc.no_of_answers);

    console.log("💾 Saving discussion...");
    await doc.save();

    console.log("✔ Answer saved successfully");
    console.log(
      "============================================================\n"
    );

    return res.status(201).json(newAnswer);
  } catch (err) {
    console.log("\n❌ ERROR CAUGHT IN addAnswer()");
    console.error("🔥 Full Error:", err);
    console.error("📌 Error Message:", err.message);
    console.error("📌 Stack Trace:", err.stack);
    console.log(
      "============================================================\n"
    );

    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const toggleEnroll = async (req, res) => {
  try {
    const userId = req.body.userId;
    const sectionKey = req.body.section;
    if (!userId || !sectionKey)
      return res.status(400).json({ message: "userId & section required" });

    let enrollment = await UserEnrollment.findOne({ userId });
    if (!enrollment) {
      enrollment = new UserEnrollment({ userId, sections: [sectionKey] });
      await enrollment.save();
      return res.json({ enrolled: true, sections: enrollment.sections });
    }
    const exists = enrollment.sections.includes(sectionKey);
    if (exists) {
      enrollment.sections = enrollment.sections.filter((s) => s !== sectionKey);
    } else {
      enrollment.sections.push(sectionKey);
    }
    await enrollment.save();
    return res.json({ enrolled: !exists, sections: enrollment.sections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserEnrollments = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const enrollment = await UserEnrollment.findOne({ userId }).lean();
    return res.json({ sections: (enrollment && enrollment.sections) || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const handleQuestionUpvote = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ id: req.params.id });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.upvotes = (discussion.upvotes || 0) + 1;
    // Optional: Prevent infinite voting if you track userId in future

    await discussion.save();
    res
      .status(200)
      .json({ message: "Upvoted successfully", upvotes: discussion.upvotes });
  } catch (err) {
    console.error("Error in upvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const handleQuestionDownvote = async (req, res) => {
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
};

export const handleQuestionReport = async (req, res) => {
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
};

// ------------------------------
// 🔹 Upvote an Answer
// ------------------------------
export const handleAnswerUpvote = async (req, res) => {
  try {
    const { id, answerId } = req.params; // discussion id & answer id
    const discussion = await Discussion.findOne({ id });

    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const answer = discussion.answers.find(
      (ans) => ans.id === parseInt(answerId)
    );
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.upvotes = (answer.upvotes || 0) + 1;
    await discussion.save();

    res.status(200).json({
      message: "Answer upvoted successfully",
      upvotes: answer.upvotes,
    });
  } catch (err) {
    console.error("Error in answer upvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------------
// 🔹 Downvote an Answer
// ------------------------------
export const handleAnswerDownvote = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const discussion = await Discussion.findOne({ id });

    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const answer = discussion.answers.find(
      (ans) => ans.id === parseInt(answerId)
    );
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.downvotes = (answer.downvotes || 0) + 1;
    await discussion.save();

    res.status(200).json({
      message: "Answer downvoted successfully",
      downvotes: answer.downvotes,
    });
  } catch (err) {
    console.error("Error in answer downvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ------------------------------
// 🔹 Report an Answer
// ------------------------------
export const handleAnswerReport = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const discussion = await Discussion.findOne({ id });

    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const answer = discussion.answers.find(
      (ans) => ans.id === parseInt(answerId)
    );
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.report_count = (answer.report_count || 0) + 1;
    await discussion.save();

    res.status(200).json({
      message: "Answer reported successfully",
      report_count: answer.report_count,
    });
  } catch (err) {
    console.error("Error in answer report:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ----------------------------------------------
   1️⃣  UPDATE ANSWER
   PUT /api/discussions/:discussionId/answers/:answerId
---------------------------------------------- */
export const updateAnswer = async (req, res) => {
  try {
    const { discussionId, answerId } = req.params;
    const { answer } = req.body;

    if (!answer)
      return res
        .status(400)
        .json({ message: "Updated answer content is required" });

    const discussion = await Discussion.findOne({ id: discussionId });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const ans = discussion.answers.find((a) => a.id === Number(answerId));
    if (!ans) return res.status(404).json({ message: "Answer not found" });

    ans.answer = answer;
    await discussion.save();

    res.json({ message: "Answer updated successfully", discussion });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------------------------
   2️⃣  DELETE ANSWER
   DELETE /api/discussions/:discussionId/answers/:answerId
---------------------------------------------- */
export const deleteAnswer = async (req, res) => {
  try {
    const { discussionId, answerId } = req.params;

    const discussion = await Discussion.findOne({ id: discussionId });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    const beforeCount = discussion.answers.length;

    discussion.answers = discussion.answers.filter(
      (a) => a.id !== Number(answerId)
    );

    if (discussion.answers.length === beforeCount)
      return res.status(404).json({ message: "Answer not found" });

    discussion.no_of_answers = discussion.answers.length;

    await discussion.save();

    res.json({ message: "Answer deleted successfully", discussion });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ----------------------------------------------
   3️⃣  HIGHLIGHT ANSWER
   POST /api/discussions/:discussionId/answers/:answerId/highlight
---------------------------------------------- */
export const highlightAnswer = async (req, res) => {
  try {
    const { discussionId, answerId } = req.params;

    const discussion = await Discussion.findOne({ id: discussionId });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    // Un-highlight all answers first (only 1 highlighted allowed)
    discussion.answers.forEach((a) => (a.is_highlighted = false));

    // Highlight selected answer
    const ans = discussion.answers.find((a) => a.id === Number(answerId));
    if (!ans) return res.status(404).json({ message: "Answer not found" });

    ans.is_highlighted = true;

    await discussion.save();

    res.json({ message: "Answer highlighted", discussion });
  } catch (error) {
    console.error("Error highlighting answer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
