const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User"); // Importing User model
const router = express.Router(); // Initializing express router

// Registration Route
router.post(
  "/register",
  [
    // Validate the request body for required fields
    body("name").notEmpty().withMessage("Name is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { name, username, password } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User created" });
  }
);

// Login Route
router.post(
  "/login",
  [
    // Validate request body for required fields
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { username, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare entered password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, "10", {
      expiresIn: "1h",
    });

    // Send success response with token, name, and score
    const gamername = user.name;
    const score = user.highScore;
    res
      .status(201)
      .json({ message: "Login successful", token, gamername, score });
  }
);

// Update Score Route
router.post(
  "/score",
  [
    // Validate request body for required fields
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("highScore").notEmpty().withMessage("High score is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { username, password, highScore } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare entered password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Update the user's high score
    user.highScore = highScore;
    await user.save();

    // Send success response
    res.status(200).json({ message: "Score updated successfully" });
  }
);

// Get Score Route
router.get(
  "/score",
  [
    // Validate request body for required fields
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare entered password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Retrieve the user's score
    const userscore = user.highScore;

    // Send success response with user's score
    res
      .status(200)
      .json({ message: "Your score found successfully", score: userscore });
  }
);

module.exports = router; // Exporting the router
