// backend/controllers/discussionController.js
import Discussion from "../../models/DiscussionModel/Discussion.js";
import UserEnrollment from "../../models/DiscussionModel/UserEnrollment.js";
import User from "../../models/UserModel/User.js";

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

export const getSections = (sectionsStatic) => async (req, res) => {
  // returns static sections + counts / trending sample
  try {
    // you can compute counts per section quickly:
    const counts = await Discussion.aggregate([
      { $group: { _id: "$section", count: { $sum: 1 } } },
    ]);
    const map = {};
    counts.forEach((c) => (map[c._id] = c.count));
    const enriched = sectionsStatic.map((s) => ({
      ...s,
      discussionCount: map[s.key] || 0,
    }));
    return res.json({ sections: enriched });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const listDiscussions = async (req, res) => {
  // supports: page, limit, section, tags (comma), q text search, sort=recent|popular|trending
  try {
    const page = Math.max(1, parseInt(req.query.page || "1"));
    const limit = Math.min(50, parseInt(req.query.limit || "10"));
    const section = req.query.section;
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
      return res.json({ data: results, page, limit, total });
    }

    const docs = await Discussion.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Discussion.countDocuments(filter);
    return res.json({ data: docs, page, limit, total });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    await ensureCounters();

    const { section, question, tags = [], authorId, authorName } = req.body;

    if (!section || !question || !authorId)
      return res
        .status(400)
        .json({ message: "section, question, and authorId are required" });

    // ✅ 1. Create discussion
    const discussion = new Discussion({
      id: nextDiscussionId++,
      section,
      question,
      authorId,
      authorName,
      tags,
    });

    await discussion.save();

    // ✅ 2. Update user's createdDiscussions list
    const user = await User.findById(authorId);
    if (user) {
      user.createdDiscussions.push(discussion._id);
      await user.save();
    }

    return res.status(201).json({
      message: "Discussion created successfully",
      discussion,
      user: {
        _id: user?._id,
        username: user?.username,
        createdDiscussions: user?.createdDiscussions,
      },
    });
  } catch (err) {
    console.error("❌ createDiscussion error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDiscussion = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doc = await Discussion.findOne({ id }).lean();
    if (!doc) return res.status(404).json({ message: "Not found" });
    return res.json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addAnswer = async (req, res) => {
  try {
    await ensureCounters();
    const id = parseInt(req.params.id);
    const { answer, authorId, authorName } = req.body;
    if (!answer || !authorId)
      return res.status(400).json({ message: "answer and authorId required" });

    const doc = await Discussion.findOne({ id });
    if (!doc) return res.status(404).json({ message: "Discussion not found" });

    const newAnswer = {
      id: nextAnswerId++,
      answer,
      author: authorName || authorId,
      authorId,
      createdAt: new Date(),
      report_count: 0,
      is_highlighted: false,
      upvotes: 0,
      downvotes: 0,
    };
    doc.answers.push(newAnswer);
    doc.no_of_answers = doc.answers.length;
    await doc.save();
    return res.status(201).json(newAnswer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
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

export const handleUpvote = async (req, res) => {
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
export const handleDownvote = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({ id: req.params.id });
    if (!discussion)
      return res.status(404).json({ message: "Discussion not found" });

    discussion.downvotes = (discussion.downvotes || 0) + 1;
    await discussion.save();

    res
      .status(200)
      .json({
        message: "Downvoted successfully",
        downvotes: discussion.downvotes,
      });
  } catch (err) {
    console.error("Error in downvote:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const handleReport = async (req, res) => {
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
