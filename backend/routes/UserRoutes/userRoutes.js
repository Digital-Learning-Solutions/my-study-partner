import express from "express";
import { getUser } from "../../controllers/user/userController.js";

const userRoutes = express.Router();

userRoutes.get("/:userId", getUser);
// userRoutes.post("/login", loginUser);

export default userRoutes;
