import User from "../../models/UserModel/user.js";
export const getUserDiscussionById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "createdDiscussions",
        select:
          "title question createdAt section id tags no_of_answers upvotes",
      })
      .lean();
    console.log("Discussions:", user.createdDiscussions);

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ discussions: user.createdDiscussions });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate([
      {
        path: "enrolledCourses.course",
        select: "title modules _id courseType slug subject",
      },
      {
        path: "enrolledQuizGroups.group",
        select: "name description _id",
      },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const { userId } = req.params;
    const { fullName, bio, avatarUrl } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profile.fullName = fullName || user.profile.fullName;
    user.profile.bio = bio || user.profile.bio;
    user.profile.avatarUrl = avatarUrl || user.profile.avatarUrl;

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
