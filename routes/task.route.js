import express from "express";
import {
  getTasks,
  addTask,
  editTask,
  deleteTask,
} from "../controllers/task.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const taskRouter = express.Router();

taskRouter.use(authenticatedUser);

taskRouter.get("/", getTasks);
taskRouter.post("/", addTask);
taskRouter.patch("/:id", editTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;