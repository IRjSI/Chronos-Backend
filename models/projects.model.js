import mongoose from "mongoose";
import taskModel from "./task.model.js";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    progress: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

projectSchema.methods.completion = async function() {
    if (!this.tasks || this.tasks.length === 0) return 0;
    
    const tasks = await taskModel.find({ _id: { $in: this.tasks } }).select("status");
    
    const completed = tasks.filter(t => t.status === "completed").length;
    console.log("cmplt::",completed);
    const total = tasks.length;
    console.log("ttl::",total);

    const percent = Math.round((completed / total) * 100);
    this.progress = percent;
    await this.save();

    return percent;
}

export default mongoose.models.Project || mongoose.model("Project", projectSchema);