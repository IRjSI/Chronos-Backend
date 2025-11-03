import projectsModel from "../models/projects.model.js";
import taskModel from "../models/task.model.js";

export async function getTasks(req, res) {
  try {
    const { category = "all" } = req.query;
    let query = {};
    if (category === "all") {
      query = {
        userId: req.user.id
      }
    } else {
      query = {
        userId: req.user.id,
        category
      }
    }

    const tasks = await taskModel.find(query)
      .populate("projectId", "title")
      .sort({ createdAt: -1 })
      .limit(24);

    res.json({
      message: "Retrieved tasks",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addTask(req, res) {
  try {
    const { title, description, category, dueDate } = req.body;
    const task = await taskModel.create({
      title,
      description,
      category,
      dueDate,
      userId: req.user.id,
    });

    if (!task) {
        res.status(400).json({ message: "Error creating task" });
    }

    res.json({
      message: "Created task",
      data: task,
    });
  } catch (error) {
    console.error("Error creating tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function editTask(req, res) {
  try {

    const { id } = req.params;
    const { title, description, category, dueDate, status } = req.body;

    const task = await taskModel.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, category, dueDate, status },
      { new: true } // return updated document
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    const projectId = task?.projectId;
    if (projectId) {
      const project = await projectsModel.findById(projectId);
      await project.completion();
    }

    res.json({ message: "Task updated", data: task });
  } catch (error) {
    console.error("Error editing task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTask(req, res) {
  try {

    const { id } = req.params;

    const task = await taskModel.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}