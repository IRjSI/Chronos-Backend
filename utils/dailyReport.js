import taskModel from "../models/task.model.js";
import projectsModel from "../models/projects.model.js";

export async function getDailyReport(req, res) {
    try {
        const userId = req.user.id;

        const now = new Date();
        const report = [];

        for (let i = 6; i >= 0; i--) {
            const startOfDay = new Date(now);
            startOfDay.setDate(now.getDate() - i);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getDate() + 1);

            const createdTasks = await taskModel.countDocuments({
                userId,
                createdAt: { $gte: startOfDay, $lt: endOfDay },
            });

            const completedTasks = await taskModel.countDocuments({
                userId,
                status: "completed",
                updatedAt: { $gte: startOfDay, $lt: endOfDay },
            })

            const projects = await projectsModel.find({ userId }).select("title progress");

            const avgProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0) / (projects.length || 1);

            report.push({
                date: startOfDay.toDateString(),
                createdTasks,
                completedTasks,
                totalProjects: projects.length,
                avgProgress: Math.round(avgProgress)
            });
        };

        res.json({
            message: "Daily report generated",
            data: report
        });
    } catch (error) {
        console.error("Error generating Daily report:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}