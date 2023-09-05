const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document in MongoDB
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Authenticate user login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Authentication failed. User not found." });
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Authentication failed. Invalid password." });
    }

    // Generate and return a JWT token for authentication.
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieve user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    // Retrieve user information from the JWT token
    const { id } = req.id;

    // Send the user profile in the response
    const user = await User.findOne({ id });
    res.status(200).json({
      username: user.username,
      // Add other user profile fields as needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user profile (protected route)
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    const { id } = req.id;

    // Find the user by ID
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user information in MongoDB
    if (username) {
      user.username = username;
    }

    if (newPassword) {
      // Hash and update the password if a new one is provided
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Send a success response
    res.status(200).json({ message: "User profile updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
