/**
 * User Router
 * Defines all user-related API routes for the expense tracker application.
 * Handles user registration, authentication, profile management, and account operations.
 */

// Import required modules
const express = require("express");                        // Express framework
const usersController = require("../controllers/usersCtrl"); // User controller functions
const isAuthenticated = require("../middlewares/isAuth");    // Authentication middleware

// Create Express router instance for user routes
const userRouter = express.Router();

// User Registration Route
// POST /api/v1/users/register - Register a new user account
userRouter.post("/api/v1/users/register", usersController.register);

// User Login Route
// POST /api/v1/users/login - Authenticate user and return JWT token
userRouter.post("/api/v1/users/login", usersController.login);

// User Profile Route (Protected)
// GET /api/v1/users/profile - Get current user's profile information
// Requires authentication via JWT token
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,              // Authentication middleware
  usersController.profile       // Profile controller function
);

// Change Password Route (Protected)
// PUT /api/v1/users/change-password - Update user's password
// Requires authentication via JWT token
userRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,                      // Authentication middleware
  usersController.changeUserPassword    // Password change controller function
);

// Update Profile Route (Protected)
// PUT /api/v1/users/update-profile - Update user's profile information
// Requires authentication via JWT token
userRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,                     // Authentication middleware
  usersController.updateUserProfile    // Profile update controller function
);

// Export the user router for use in the main application
module.exports = userRouter;
