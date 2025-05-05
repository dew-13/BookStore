// filepath: c:\xampp\htdocs\VO\bookshop\generate-jwt.js
require("dotenv").config(); // Load environment variables from .env
const jwt = require("jsonwebtoken");

// Define the payload for the JWT
const payload = {
  id: "cmaaqsbyg0000bfh0dzmconyy", // Replace with the user's ID
  username: "user two", // Replace with the user's username
  email: "user2@abc.com", // Replace with the user's email
};

// Define the secret and options
const secret = process.env.JWT_SECRET;
const options = {
  expiresIn: "24h", // Token expiration time
};

// Generate the JWT
const token = jwt.sign(payload, secret, options);

console.log("Generated JWT:", token);