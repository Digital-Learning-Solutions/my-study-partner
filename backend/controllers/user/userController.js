import User from "../../models/UserModel/User.js";

export async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user, message: "User fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
