const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");

// Apply middleware before defining routes
app.use(express.json()); // Parse JSON
app.use(cors()); // Allow cross-origin requests

// Define routes
app.use("/api/score", scoreRoutes); // Use for knowing the score
app.use("/api/auth", authRoutes); // Use for authorization

// Catch-all route for basic server status
app.use("/", (req, res) => {
  return res.send("Server is running");
});

// MongoDB connection (add a database name, e.g., gameDB)
const mongooseUrl =
  "mongodb+srv://eonsync0:opgjQIHPG09lsLs5@datagame.7up64.mongodb.net/";

mongoose
  .connect(mongooseUrl) // Use recommended options
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
