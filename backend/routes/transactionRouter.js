/**
 * Transaction Router
 * Defines all transaction-related API routes for the expense tracker application.
 * Handles CRUD operations for financial transactions (income and expense records).
 */

// Import required modules
const express = require("express");                            // Express framework
const usersController = require("../controllers/usersCtrl");     // User controller (unused in this file)
const isAuthenticated = require("../middlewares/isAuth");        // Authentication middleware
const categoryController = require("../controllers/categoryCtrl"); // Category controller (unused in this file)
const transactionController = require("../controllers/transactionCtrl"); // Transaction controller functions

// Create Express router instance for transaction routes
const transactionRouter = express.Router();

// Create Transaction Route (Protected)
// POST /api/v1/transactions/create - Create a new transaction for the authenticated user
// Requires authentication via JWT token
transactionRouter.post(
  "/api/v1/transactions/create",
  isAuthenticated,                  // Authentication middleware
  transactionController.create      // Transaction creation controller function
);

// List Transactions Route (Protected)
// GET /api/v1/transactions/lists - Get filtered transactions for the authenticated user
// Supports filtering by date range, category, type, etc.
// Requires authentication via JWT token
transactionRouter.get(
  "/api/v1/transactions/lists",
  isAuthenticated,                              // Authentication middleware
  transactionController.getFilteredTransactions // Filtered transaction listing controller function
);

// Update Transaction Route (Protected)
// PUT /api/v1/transactions/update/:id - Update a specific transaction
// Requires authentication via JWT token and transaction ID as URL parameter
transactionRouter.put(
  "/api/v1/transactions/update/:id",
  isAuthenticated,                  // Authentication middleware
  transactionController.update      // Transaction update controller function
);

// Delete Transaction Route (Protected)
// DELETE /api/v1/transactions/delete/:id - Delete a specific transaction
// Requires authentication via JWT token and transaction ID as URL parameter
transactionRouter.delete(
  "/api/v1/transactions/delete/:id",
  isAuthenticated,                  // Authentication middleware
  transactionController.delete      // Transaction deletion controller function
);

// Export the transaction router for use in the main application
module.exports = transactionRouter;
