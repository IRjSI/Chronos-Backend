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
} from "../controllers/project.controller.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";

const projectRouter = express.Router();

projectRouter.use(authenticatedUser);

projectRouter.get("/", getProjects);
projectRouter.get("/tasks/:projectId", getProjectTasks);
projectRouter.post("/", addProject);
projectRouter.post("/tasks/:projectId", addProjectTask);
projectRouter.patch("/:id", editProject);
projectRouter.patch("/tasks/:projectId/:taskId", editProjectTask);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.delete("/tasks/:taskId", deleteProjectTask);

export default projectRouter;