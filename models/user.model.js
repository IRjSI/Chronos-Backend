import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String, unique: true, required: true
  },
  image: {
    type: String
  },
  emailVerified: {
    type: Boolean, default: false
  },
  streak: {
    type: Number, default: 1
  },
  lastActiveDate: {
    type: Date, default: null
  },

  // Optional fields for your app
  role: {
    type: String, enum: ["user", "admin"], default: "user"
  },
  createdAt: {
    type: Date, default: Date.now
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);