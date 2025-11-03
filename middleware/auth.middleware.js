import { getSession } from "@auth/express";
import { authOptions } from "../utils/authOptions.js";
import userModel from "../models/user.model.js";

export async function authenticatedUser(req, res, next) {
  try {
    const session = await getSession(req, authOptions);

    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const dbUser = await userModel.findOne({ email: session.user.email }).select("_id name email");

    if (!dbUser) {
      return res.status(404).json({ error: "User not found in database." });
    }

    // Attach full user object
    req.user = {
      id: dbUser._id,
      name: dbUser.name,
      email: dbUser.email,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Authentication check failed." });
  }
}
