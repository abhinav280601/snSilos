const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // Extract the token from the request header
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID
    // const user = await User.findOne({ _id: decoded._id });

    // if (!user) {
    //   throw new Error();
    // }

    // Attach the user and token to the request for further use
    req.id = decoded._id;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};
