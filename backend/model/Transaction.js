/**
 * Transaction Model
 * Defines the database schema for financial transactions in the expense tracker application.
 * Handles both income and expense transactions with categorization and detailed information.
 */

// Import Mongoose for MongoDB object modeling
const mongoose = require("mongoose");

/**
 * Transaction Schema Definition
 * Defines the structure and validation rules for transaction documents in MongoDB
 */
const transactionSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this transaction
    user: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId reference
      ref: "User",     // References the User model
      required: true,  // Every transaction must belong to a user
    },
    
    // Transaction type - determines if it's income or expense
    type: {
      type: String,
      required: true,                // Type is mandatory
      enum: ["income", "expense"],  // Only these two values are allowed
    },
    
    // Category name for organizing transactions (e.g., "Food", "Salary")
    category: {
      type: String,
      required: true,                // Category is mandatory
      default: "Uncategorized",     // Default category for unclassified transactions
    },
    
    // Transaction amount in the base currency
    amount: {
      type: Number,
      required: true,  // Amount is mandatory for all transactions
    },
    
    // Date when the transaction occurred
    date: {
      type: Date,
      default: Date.now,  // Defaults to current date/time if not specified
    },
    
    // Optional description or notes about the transaction
    description: {
      type: String,
      required: false,  // Description is optional
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Transaction model for use in controllers and other modules
module.exports = mongoose.model("Transaction", transactionSchema);
