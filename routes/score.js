const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Save Game Score
router.post("/save-score", async (req, res) => {
  const { userId, score } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(400).json({ message: "User not found" });

  user.pastScores.push(score);
  if (score > user.highScore) {
    user.highScore = score;
  }
  await user.save();
  res.json({ message: "Score saved", highScore: user.highScore });
});

module.exports = router;
