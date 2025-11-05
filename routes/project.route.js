import express from "express";
import {
  getProjects,
  addProject,
  editProject,
  deleteProject,
  getProjectTasks,
  addProjectTask,
  editProjectTask,
  deleteProjectTask,
  getComments,
  addComment,
  editComment,
  deleteComment,
} from "../controllers/project.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.use(authenticatedUser);

projectRouter.get("/", getProjects);
projectRouter.get("/tasks/:projectId", getProjectTasks);
projectRouter.get("/comments/:projectId", getComments);
projectRouter.post("/", addProject);
projectRouter.post("/tasks/:projectId", addProjectTask);
projectRouter.post("/comments/:projectId", addComment);
projectRouter.patch("/:id", editProject);
projectRouter.patch("/tasks/:projectId/:taskId", editProjectTask);
projectRouter.patch("/comments/:projectId/:commentId", editComment);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.delete("/tasks/:taskId", deleteProjectTask);
projectRouter.delete("/comments/:commentId", deleteComment);

export default projectRouter;