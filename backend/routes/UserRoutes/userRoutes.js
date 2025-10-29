import express from "express";
import {
  getUser,
  updateUserProfile,
  getUserDiscussionById,
} from "../../controllers/user/userController.js";

const userRoutes = express.Router();

userRoutes.get("/:userId", getUser);
userRoutes.get("/discussions/:id", getUserDiscussionById);
// userRoutes.post("/login", loginUser);
userRoutes.put("/:userId", updateUserProfile);

export default userRoutes;
