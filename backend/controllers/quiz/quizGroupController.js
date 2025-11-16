// controllers/quizGroupController.js
import QuizGroup from "../../models/QuizModel/QuizGroup.js";
import User from "../../models/UserModel/user.js";
import mongoose from "mongoose";

/**
 * Create a new quiz group
 * req.body: { userId, name, description, settings }
 */
export async function createGroup(req, res) {
  try {
    console.log("createGroup called. req.body:", req.body);
    const { userId, name, description, settings } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (!name) return res.status(400).json({ message: "Name is required" });

    // check unique
    const exists = await QuizGroup.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Group name already exists" });
    }

    const adminUser = await User.findById(userId).select("username profile");

    const group = new QuizGroup({
      name,
      description,
      admin: userId,
      members: [
        {
          user: userId,
          name: adminUser?.username || adminUser?.profile?.fullName || "Admin",
        },
      ],
      settings: settings || {},
      leaderboard: [],
      joinRequests: [],
    });

    await group.save();
    console.log("createGroup: saved group with id", group._id.toString());
    // add to user's enrolled groups
    await User.findByIdAndUpdate(userId, {
      $push: { enrolledQuizGroups: { group: group._id } },
    });

    res.status(201).json({ success: true, group });
  } catch (err) {
    console.error("❌ createGroup error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Search groups by name (?search=term)
 */
export async function searchGroups(req, res) {
  try {
    const q = req.query.search || "";

    const groups = await QuizGroup.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name description members admin createdAt")
      .limit(30)
      .lean();

    res.json({
      success: true,
      groups: groups.map((g) => ({
        ...g,
        memberCount: g.members?.length || 0,
      })),
    });
  } catch (err) {
    console.error("❌ searchGroups error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Request to join a group
 * req.body: { userId, message }
 */
export async function requestJoin(req, res) {
  try {
    const groupId = req.params.id;
    const { userId, message } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if already member
    if (group.members.some((m) => m.user?.toString() === userId)) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Check if request already pending
    const alreadyRequested = group.joinRequests.some(
      (r) => r.user?.toString() === userId && r.status === "pending"
    );
    if (alreadyRequested) {
      return res.status(400).json({ message: "Request already pending" });
    }

    const user = await User.findById(userId).select("username");

    group.joinRequests.push({
      user: userId,
      name: user?.username || "Unknown",
      message,
    });

    await group.save();

    // also store in user's joinRequests
    await User.findByIdAndUpdate(userId, {
      $push: { joinRequests: { group: groupId, status: "pending" } },
    });

    // notify admin via socket
    const io = req.app.get("io");
    if (io) {
      io.to(group.admin.toString()).emit("group-join-request", {
        groupId,
        userId,
        name: user?.username,
      });
    }

    res.json({ success: true, message: "Join request sent" });
  } catch (err) {
    console.error("❌ requestJoin error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Approve or reject join request
 * req.body: { userId, action }
 */
export async function handleJoinRequest(req, res) {
  try {
    const groupId = req.params.id;
    const requesterId = req.params.userId;
    const { userId: actorId, action } = req.body;

    if (!actorId)
      return res.status(400).json({ message: "userId is required" });

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== actorId) {
      return res
        .status(403)
        .json({ message: "Only admin can manage requests" });
    }

    const reqIndex = group.joinRequests.findIndex(
      (r) => r.user.toString() === requesterId && r.status === "pending"
    );

    if (reqIndex === -1)
      return res.status(404).json({ message: "Request not found" });

    // APPROVE
    if (action === "approve") {
      const user = await User.findById(requesterId).select("username");

      group.members.push({
        user: requesterId,
        name: user?.username || "Unknown",
      });

      // ❗ REMOVE request completely
      group.joinRequests.splice(reqIndex, 1);
      await group.save();

      // update user
      await User.findByIdAndUpdate(requesterId, {
        $push: { enrolledQuizGroups: { group: group._id } },
        $pull: { joinRequests: { group: groupId } },
      });

      const io = req.app.get("io");
      if (io) {
        io.to(requesterId.toString()).emit("group-join-approved", {
          groupId,
          name: group.name,
        });
      }

      return res.json({
        success: true,
        message: "User approved and added to group",
      });
    }

    // REJECT
    group.joinRequests.splice(reqIndex, 1); // ❗ remove rejected request
    await group.save();

    await User.findByIdAndUpdate(requesterId, {
      $pull: { joinRequests: { group: groupId } },
    });

    const io = req.app.get("io");
    if (io) {
      io.to(requesterId.toString()).emit("group-join-rejected", {
        groupId,
        name: group.name,
      });
    }

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    console.error("❌ handleJoinRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * List groups user is a member of
 * req.body: { userId }
 */
export async function listUserGroups(req, res) {
  console.log("📌 listUserGroups() called");
  console.log("➡️ Incoming query:", req.query);

  try {
    const { userId } = req.query;

    console.log("🔍 Extracted userId:", userId);

    // Validate
    if (!userId) {
      console.log("❌ Missing userId!");
      return res.status(400).json({ message: "userId is required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("❌ Invalid ObjectId format:", userId);
      return res.status(400).json({ message: "Invalid userId" });
    }

    console.log("🔎 Running Mongo query for userId:", userId);

    const groups = await QuizGroup.find({
      "members.user": new mongoose.Types.ObjectId(userId),
    })
      .select("name description members leaderboard createdAt")
      .lean()
      .catch((err) => {
        console.error("❌ MongoDB Query Error:", err);
        throw err;
      });

    console.log("✅ Query success. Found:", groups.length, "groups");

    return res.json({ success: true, groups });
  } catch (err) {
    console.error("🔥 FATAL ERROR in listUserGroups:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
}

/**
 * Start game (admin only)
 * req.body: { userId, questionsCount }
 */
export async function startGame(req, res) {
  try {
    const groupId = req.params.id;
    const { userId, questionsCount } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can start the game" });
    }

    group.isActiveGame = true;
    group.activeGameMeta = {
      startedAt: new Date(),
      startedBy: userId,
      questionsCount: questionsCount || 10,
    };

    await group.save();

    const io = req.app.get("io");
    if (io) {
      io.to(groupId.toString()).emit("group-game-start", {
        groupId,
        startedAt: group.activeGameMeta.startedAt,
        questionsCount: group.activeGameMeta.questionsCount,
      });
    }

    res.json({ success: true, message: "Game started" });
  } catch (err) {
    console.error("❌ startGame error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// controllers/quizGroupController.js
export async function endActiveGame(req, res) {
  try {
    const groupId = req.params.id;

    const group = await QuizGroup.findByIdAndUpdate(
      groupId,
      { isActiveGame: false },
      { new: true }
    );

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ endActiveGame error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Submit game result
 * req.body: { userId, results, questionsSnapshot }
 */
export async function submitGameResult(req, res) {
  try {
    const groupId = req.params.id;
    const { userId, results, questionsSnapshot } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const historyItem = {
      playedAt: new Date(),
      questions: questionsSnapshot || [],
      results: results.map((r) => ({
        user: r.user,
        name: r.name,
        score: r.score,
        answers: r.answers || [],
      })),
    };

    group.resultHistory.unshift(historyItem);

    // update leaderboard
    const lb = group.leaderboard || [];
    results.forEach((r) => {
      const index = lb.findIndex(
        (e) => e.user?.toString() === r.user.toString()
      );
      if (index !== -1) {
        lb[index].score = r.score;
        lb[index].name = r.name;
      } else {
        lb.push({
          user: r.user,
          name: r.name,
          score: r.score,
        });
      }
    });

    group.leaderboard = lb.sort((a, b) => b.score - a.score).slice(0, 100);

    group.isActiveGame = false;
    group.activeGameMeta = null;

    await group.save();

    // notify group
    const io = req.app.get("io");
    if (io) {
      io.to(groupId.toString()).emit("group-game-ended", {
        groupId,
        historyItem,
        leaderboard: group.leaderboard,
      });
    }

    res.json({
      success: true,
      message: "Results recorded",
      historyItem,
    });
  } catch (err) {
    console.error("❌ submitGameResult error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * Get group history
 */
export async function getGroupHistory(req, res) {
  try {
    const groupId = req.params.id;

    const group = await QuizGroup.findById(groupId)
      .select(
        "name description members admin isActiveGame leaderboard resultHistory joinRequests settings createdAt"
      )
      .populate("resultHistory.results.user", "username profile")
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json({ success: true, group });
  } catch (err) {
    console.error("❌ getGroupHistory error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function joinLobby(req, res) {
  try {
    const groupId = req.params.id;
    const { userId, username } = req.body;

    if (!userId || !username)
      return res.status(400).json({ message: "userId & username required" });

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Prevent duplicate join
    const alreadyJoined = group.joinedLobby.some(
      (p) => p.userId.toString() === userId
    );
    if (!alreadyJoined) {
      group.joinedLobby.push({ userId, username });
      await group.save();
    }

    res.json({ success: true, joinedLobby: group.joinedLobby });
  } catch (err) {
    console.error("❌ joinLobby error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function leaveLobby(req, res) {
  try {
    const groupId = req.params.id;
    const { userId } = req.body;

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.joinedLobby = group.joinedLobby.filter(
      (p) => p.userId.toString() !== userId
    );

    await group.save();

    res.json({ success: true, joinedLobby: group.joinedLobby });
  } catch (err) {
    console.error("❌ leaveLobby error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function getLobbyPlayers(req, res) {
  try {
    const groupId = req.params.id;
    const group = await QuizGroup.findById(groupId)
      .select("joinedLobby")
      .lean();

    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json({ success: true, joinedLobby: group.joinedLobby });
  } catch (err) {
    console.error("❌ getLobbyPlayers error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
export async function clearLobby(req, res) {
  try {
    const groupId = req.params.id;

    const group = await QuizGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.joinedLobby = [];
    await group.save();

    res.json({ success: true });
  } catch (err) {
    console.error("❌ clearLobby error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
/**
 * Return questions assigned to the group
 * URL: GET /api/quiz-groups/:id/questions
 */
export async function getGroupQuestions(req, res) {
  try {
    const groupId = req.params.id;

    const group = await QuizGroup.findById(groupId).lean();
    if (!group) return res.status(404).json({ message: "Group not found" });

    // 1️⃣ If your group has predefined questions inside settings
    const questionsFromSettings = group.settings?.questions || [];

    // 2️⃣ Return them
    return res.json({
      success: true,
      questions: questionsFromSettings,
    });
  } catch (err) {
    console.error("❌ getGroupQuestions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
/**
 * Save group game result (socket-driven)
 * URL: POST /api/quiz-groups/:id/results
 * body: { userId, username, answers, score }
 */
export async function saveGroupGameResult(req, res) {
  try {
    const groupId = req.params.id;
    const { userId, username, answers, score } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    // 1️⃣ Ensure history exists
    await QuizGroup.findByIdAndUpdate(
      groupId,
      {
        $setOnInsert: {
          resultHistory: [{ playedAt: new Date(), results: [] }],
        },
      },
      { upsert: false }
    );

    // 2️⃣ Remove old entry for this user
    await QuizGroup.findByIdAndUpdate(groupId, {
      $pull: { "resultHistory.0.results": { user: userId } },
    });

    // 3️⃣ Add new entry
    await QuizGroup.findByIdAndUpdate(groupId, {
      $push: {
        "resultHistory.0.results": {
          user: userId,
          name: username,
          score,
          answers,
        },
      },
    });

    // 4️⃣ Update leaderboard
    await QuizGroup.findByIdAndUpdate(groupId, {
      $pull: { leaderboard: { user: userId } },
    });

    await QuizGroup.findByIdAndUpdate(groupId, {
      $push: {
        leaderboard: {
          user: userId,
          name: username,
          score,
        },
      },
    });

    // 5️⃣ Sort leaderboard
    await QuizGroup.findByIdAndUpdate(groupId, {
      $push: {
        leaderboard: { $each: [], $sort: { score: -1 } },
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ saveGroupGameResult error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
