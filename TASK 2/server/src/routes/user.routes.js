import express from "express";
import {
  createUser,
  deleteAccount,
  editUserDetails,
  getUserDetails,
  login,
  logout,
} from "../controllers/user.controller.js";
import { isLoggedin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);

router.get("/userDetails", isLoggedin, getUserDetails);

router.patch("/editUser", isLoggedin, editUserDetails);

router.post("/login", login);

router.post("/logout", logout);

router.delete("/delete", isLoggedin, deleteAccount);

export default router;
