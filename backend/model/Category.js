/**
 * Category Model
 * Defines the database schema for transaction categories in the expense tracker application.
 * Categories are used to organize and classify income and expense transactions.
 */

// Import Mongoose for MongoDB object modeling
const mongoose = require("mongoose");

/**
 * Category Schema Definition
 * Defines the structure and validation rules for category documents in MongoDB
 */
const categorySchema = new mongoose.Schema(
  {
    // Reference to the user who owns this category
    user: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId reference
      ref: "User",     // References the User model
      required: true,  // Every category must belong to a user
    },
    
    // Category name (e.g., "Food", "Transportation", "Salary")
    name: {
      type: String,
      required: true,                // Category name is mandatory
      default: "Uncategorized",     // Default value for new categories
    },
    
    // Category type - determines if it's for income or expense transactions
    type: {
      type: String,
      required: true,                // Type is mandatory
      enum: ["income", "expense"],  // Only these two values are allowed
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Category model for use in controllers and other modules
module.exports = mongoose.model("Category", categorySchema);
