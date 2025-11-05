
import { getSession } from "@auth/express";
import projectsModel from "../models/projects.model.js";
import taskModel from "../models/task.model.js";
import commentModel from "../models/comment.model.js";

/**
 * GET /projects
 * Retrieve all projects for the logged-in user
 */
export async function getProjects(req, res) {
  try {

    const projects = await projectsModel.find({ userId: req.user.id });
    
    res.json({ message: "Retrieved projects", data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * GET /projects/tasks/:id
 * Retrieve all project tasks for the logged-in user
 */
export async function getProjectTasks(req, res) {
  try {

    const { projectId } = req.params;
    const projectTasks = await taskModel.find({ userId: req.user.id, projectId: projectId });
    const projectProgress = await projectsModel.findById(projectId).select("progress");
    
    res.json({ message: "Retrieved project tasks", data: { projectTasks, projectProgress } });
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getComments(req, res) {
  try {

    const { projectId } = req.params;
    const comments = await commentModel.find({ userId: req.user.id, projectId: projectId });
    
    res.json({ message: "Retrieved project comments", data: comments });
  } catch (error) {
    console.error("Error fetching project comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /projects
 * Create a new project
 */
export async function addProject(req, res) {
  try {

    const { title, description, startDate, endDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await projectsModel.create({
      title,
      description,
      startDate,
      endDate,
      userId: req.user.id,
    });

    res.status(201).json({ message: "Created project", data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /projects/tasks/:projectId
 * Create a new project task
 */
export async function addProjectTask(req, res) {
  try {

    const { projectId } = req.params;
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const projectTask = await taskModel.create({
      title,
      description,
      category: "hobby",
      dueDate,
      userId: req.user.id,
      projectId
    });

    const project = await projectsModel.findByIdAndUpdate(projectId, { 
      $push: {
        tasks: projectTask._id
      }
    }, { new: true });

    const progress = await project.completion();

    res.status(201).json({ message: "Created project task", data: { projectTask, progress } });
  } catch (error) {
    console.error("Error creating project task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addComment(req, res) {
  try {

    const { projectId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });

    const comment = await commentModel.create({
      content,
      userId: req.user.id,
      projectId
    });

    await projectsModel.findByIdAndUpdate(projectId, { 
      $push: {
        comment: comment._id
      }
    }, { new: true });

    res.status(201).json({ message: "Created project comment", data: comment });
  } catch (error) {
    console.error("Error creating project comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUT /projects/:id
 * Edit an existing project
 */
export async function editProject(req, res) {
  try {

    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const project = await projectsModel.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, startDate, endDate },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project updated", data: project });
  } catch (error) {
    console.error("Error editing project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editComment(req, res) {
  try {

    const { projectId } = req.params;
    const { content } = req.body;

    const comment = await commentModel.findOneAndUpdate(
      { userId: req.user.id, projectId },
      { content },
      { new: true }
    );

    if (!comment) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Comment updated", data: comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PUT /projects/tasks/:projectId/:taskId
 * Edit an existing project
 */
export async function editProjectTask(req, res) {
  try {

    const { projectId, taskId } = req.params;
    const { title, description, dueDate, status } = req.body;

    const task = await taskModel.findOneAndUpdate(
      { _id: taskId, userId: req.user.id },
      { title, description, dueDate, status },
      { new: true } // return updated document
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await projectsModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const progress = await project.completion();

    res.status(201).json({ message: "Task updated", data: { task, progress } });
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /projects/:id
 * Delete an existing project
 */
export async function deleteProject(req, res) {
  try {

    const { projectId } = req.params;
    const project = await projectsModel.findOneAndDelete({
      _id: projectId,
      userId: req.user.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * DELETE /projects/tasks/:taskId
 * Delete an existing project
 */
export async function deleteProjectTask(req, res) {
  try {

    const { taskId } = req.params;
    const project = await taskModel.findOneAndDelete({
      _id: taskId,
      userId: req.user.id,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function deleteComment(req, res) {
  try {

    const { commentId } = req.params;
    const comment = await commentModel.findOneAndDelete({
      _id: commentId,
      userId: req.user.id,
    });

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}