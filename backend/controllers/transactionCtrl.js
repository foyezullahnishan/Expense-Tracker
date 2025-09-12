/**
 * Transaction Controller Module
 * Handles all transaction-related operations including CRUD operations
 * for income and expense transactions in the expense tracker application.
 */

// Import required dependencies
const asyncHandler = require("express-async-handler"); // Async error handling wrapper
const Category = require("../model/Category"); // Category model for validation
const Transaction = require("../model/Transaction"); // Transaction model for database operations

/**
 * Transaction Controller Object
 * Contains all controller methods for transaction management
 */
const transactionController = {
  /**
   * Create New Transaction
   * Creates a new income or expense transaction for the authenticated user
   * @route POST /api/transactions
   * @access Private (requires authentication)
   */
  create: asyncHandler(async (req, res) => {
    const { type, category, amount, date, description } = req.body;
    
    // Validate required fields
    if (!amount || !type || !date) {
      throw new Error("Type, amount and date are required");
    }
    
    // Create new transaction
    const transaction = await Transaction.create({
      user: req.user, // Associate with authenticated user
      type,
      category,
      amount,
      description,
    });
    
    // Send success response with created transaction
    res.status(201).json(transaction);
  }),

  /**
   * Get Filtered Transactions
   * Retrieves transactions with optional filtering by date range, type, and category
   * @route GET /api/transactions
   * @access Private (requires authentication)
   * @query {string} startDate - Filter transactions from this date
   * @query {string} endDate - Filter transactions until this date
   * @query {string} type - Filter by transaction type (income/expense)
   * @query {string} category - Filter by category name
   */
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category } = req.query;
    
    // Initialize filters with user authentication
    let filters = { user: req.user };

    // Apply date range filters
    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    
    // Apply transaction type filter
    if (type) {
      filters.type = type;
    }
    
    // Apply category filter with special handling
    if (category) {
      if (category === "All") {
        // No category filter needed when filtering for 'All'
      } else if (category === "Uncategorized") {
        // Filter for transactions that are specifically categorized as 'Uncategorized'
        filters.category = "Uncategorized";
      } else {
        // Filter for specific category
        filters.category = category;
      }
    }
    
    // Find transactions with applied filters and sort by date (newest first)
    const transactions = await Transaction.find(filters).sort({ date: -1 });
    
    // Send filtered transactions
    res.json(transactions);
  }),

  /**
   * Update Transaction
   * Updates an existing transaction with new data
   * @route PUT /api/transactions/:id
   * @access Private (requires authentication and ownership)
   */
  update: asyncHandler(async (req, res) => {
    // Find the transaction to update
    const transaction = await Transaction.findById(req.params.id);
    
    // Verify transaction exists and user is authorized
    if (transaction && transaction.user.toString() === req.user.toString()) {
      // Update transaction fields with new values or keep existing ones
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.date = req.body.date || transaction.date;
      transaction.description = req.body.description || transaction.description;
      
      // Save updated transaction to database
      const updatedTransaction = await transaction.save();
      
      // Send updated transaction
      res.json(updatedTransaction);
    }
  }),
  /**
   * Delete Transaction
   * Removes a transaction from the database
   * @route DELETE /api/transactions/:id
   * @access Private (requires authentication and ownership)
   */
  delete: asyncHandler(async (req, res) => {
    // Find the transaction to delete
    const transaction = await Transaction.findById(req.params.id);
    
    // Verify transaction exists and user is authorized
    if (transaction && transaction.user.toString() === req.user.toString()) {
      // Delete the transaction from database
      await Transaction.findByIdAndDelete(req.params.id);
      
      // Send success response
      res.json({ message: "Transaction removed" });
    }
  }),
};

// Export the transaction controller for use in routes
module.exports = transactionController;
