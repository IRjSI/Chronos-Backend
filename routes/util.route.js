import express from "express";
import { getWeeklyReport } from "../utils/weeklyReport.js";
import { updateStreak } from "../utils/streakUpdate.js";
import { authenticatedUser } from "../middleware/auth.middleware.js";
import { getCompletedTasks } from "../utils/completedTasks.js";
import { getProgress } from "../utils/projectProgress.js";
import { getDailyReport } from "../utils/dailyReport.js";
import { getWeeklySummary } from "../utils/aiSummary.js";

const utilRouter = express.Router();

utilRouter.use(authenticatedUser);

utilRouter.get("/report", getWeeklyReport);
utilRouter.get("/daily-report", getDailyReport);
utilRouter.get("/streak", updateStreak);
utilRouter.get("/progress", getProgress);
utilRouter.get("/completed-tasks", getCompletedTasks);
utilRouter.post("/summary", getWeeklySummary);

export default utilRouter;