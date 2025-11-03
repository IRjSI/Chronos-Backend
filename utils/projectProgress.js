import projectsModel from "../models/projects.model.js";

export async function getProgress(req, res) {
    try {
        const userId = req.user.id;

        const progress = await projectsModel.find({ userId }).select("progress title");
        if (!progress) {
            res.json({
                message: "no project with this id found"
            })
        }

        res.json({
            progress: progress
        })
    } catch (error) {
        console.log("error retrieving completed tasks: ", error);
    }
}