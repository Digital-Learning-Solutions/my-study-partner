import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/UserModel/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Register new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: crypto.randomUUID(),
      username,
      email,
      password: hashedPassword,
      profile: { fullName },
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.profile.fullName,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
