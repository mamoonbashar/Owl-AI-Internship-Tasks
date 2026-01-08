import express from "express";
import { isLoggedin } from "../middleware/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/task.controller.js";
const router = express.Router();

router.get("/tasks", isLoggedin, getTask);

router.post("/create", isLoggedin, createTask);

router.patch("/update/:id", isLoggedin, updateTask);

router.delete("/delete/:id", isLoggedin, deleteTask);

export default router;
