/**
 * Category Router
 * Defines all category-related API routes for the expense tracker application.
 * Handles CRUD operations for transaction categories (income and expense categories).
 */

// Import required modules
const express = require("express");                          // Express framework
const usersController = require("../controllers/usersCtrl");   // User controller (unused in this file)
const isAuthenticated = require("../middlewares/isAuth");      // Authentication middleware
const categoryController = require("../controllers/categoryCtrl"); // Category controller functions

// Create Express router instance for category routes
const categoryRouter = express.Router();

// Create Category Route (Protected)
// POST /api/v1/categories/create - Create a new category for the authenticated user
// Requires authentication via JWT token
categoryRouter.post(
  "/api/v1/categories/create",
  isAuthenticated,              // Authentication middleware
  categoryController.create     // Category creation controller function
);

// List Categories Route (Protected)
// GET /api/v1/categories/lists - Get all categories for the authenticated user
// Requires authentication via JWT token
categoryRouter.get(
  "/api/v1/categories/lists",
  isAuthenticated,              // Authentication middleware
  categoryController.lists      // Category listing controller function
);

// Update Category Route (Protected)
// PUT /api/v1/categories/update/:categoryId - Update a specific category
// Requires authentication via JWT token and category ID as URL parameter
categoryRouter.put(
  "/api/v1/categories/update/:categoryId",
  isAuthenticated,              // Authentication middleware
  categoryController.update     // Category update controller function
);

// Delete Category Route (Protected)
// DELETE /api/v1/categories/delete/:id - Delete a specific category
// Requires authentication via JWT token and category ID as URL parameter
categoryRouter.delete(
  "/api/v1/categories/delete/:id",
  isAuthenticated,              // Authentication middleware
  categoryController.delete     // Category deletion controller function
);

// Export the category router for use in the main application
module.exports = categoryRouter;
