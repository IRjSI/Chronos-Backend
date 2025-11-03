import taskModel from "../models/task.model.js";
import projectsModel from "../models/projects.model.js";

export async function getWeeklyReport(req, res) {
    try {
        const userId = req.user.id;
        
        const now = new Date();
        // Calculate the start of the week (Sunday as day 0)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Calculate the end of the week (next Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        endOfWeek.setHours(0, 0, 0, 0);
        const createdTasks = await taskModel.find({
            userId,
            createdAt: { $gte: startOfWeek, $lt: endOfWeek },
        });

        const completedTasks = await taskModel.find({
            userId,
            status: "completed",
            updatedAt: { $gte: startOfWeek, $lt: endOfWeek },
        })

        const projects = await projectsModel.find({ userId }).select("title progress");

        const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / (projects.length || 1);

        res.json({
            message: "Weekly report generated",
            data: {
                createdTasks: createdTasks.length,
                completedTasks: completedTasks.length,
                totalProjects: projects.length,
                avgProgress: Math.round(avgProgress),
                createdTaskDetails: createdTasks,
                completedTaskDetails: completedTasks,
            },
        });
    } catch (error) {
        console.error("Error generating weekly report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}