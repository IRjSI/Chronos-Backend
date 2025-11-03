import taskModel from "../models/task.model.js";
import userModel from "../models/user.model.js";

export async function getCompletedTasks(req, res) {
    try {
        const userId = req.user.id;
    
        const user = await userModel.findById(userId);
        if (!user) return;
    
        const completedTasks = await taskModel.find({
            userId,
            status: "completed"
        });
    
        res.json({
            length: completedTasks.length
        });
    } catch (error) {
        console.log("error retrieving completed tasks: ", error);
    }
}