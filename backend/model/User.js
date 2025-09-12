/**
 * User Model
 * Defines the database schema for user accounts in the expense tracker application.
 * Handles user authentication data including username, email, and hashed password.
 */

// Import Mongoose for MongoDB object modeling
const mongoose = require("mongoose");

/**
 * User Schema Definition
 * Defines the structure and validation rules for user documents in MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    // User's display name - must be unique across the application
    username: {
      type: String,
      required: true, // Username is mandatory for registration
      unique: true,   // No two users can have the same username
    },
    
    // User's email address - used for login and communication
    email: {
      type: String,
      required: true, // Email is mandatory for registration
      unique: true,   // No two users can have the same email
    },
    
    // User's password - stored as hashed value for security
    password: {
      type: String,
      required: true, // Password is mandatory for authentication
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the User model for use in controllers and other modules
module.exports = mongoose.model("User", userSchema);
