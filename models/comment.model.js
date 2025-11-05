import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);