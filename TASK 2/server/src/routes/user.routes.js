import express from "express";
import {
  createUser,
  deleteAccount,
  login,
  logout,
} from "../controllers/user.controller.js";
import { isLoggedin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", createUser);

router.post("/login", login);

router.post("/logout", logout);

router.delete("/delete", isLoggedin, deleteAccount);

export default router;
