import userModel from "../models/user.model.js";

export async function updateStreak(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId);
  if (!user) return;
  
  const today = new Date();
  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  
  if (!lastActive) {
    user.streak = 1;
    user.lastActiveDate = today;
    await user.save();
    res.json({
      streak: user.streak
    });
  }
  
  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24)); // today - lastActive gives result in ms, therefore, divide by 1000*60*60*24 to get in days
  
  if (diffDays === 0) { // active today so, no streak update, just return the current streak
    res.json({
      streak: user.streak
    })
  } else if (diffDays === 1) { // last active yesterday, +1
    user.streak += 1;
  } else { // missed a day, reset to 1
    user.streak = 1;
  }
  
  user.lastActiveDate = today;
  await user.save();

  res.json({
    streak: user.streak
  })
}