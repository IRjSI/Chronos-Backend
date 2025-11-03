import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["life", "health", "academics", "hobby"],
        default: "academics",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    },
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);