/**
 * Category Controller Module
 * Handles all category-related operations including CRUD operations
 * for expense and income categories in the expense tracker application.
 */

// Import required dependencies
const asyncHandler = require("express-async-handler"); // Async error handling wrapper
const Category = require("../model/Category"); // Category model for database operations
const Transaction = require("../model/Transaction"); // Transaction model for updating related records

/**
 * Category Controller Object
 * Contains all controller methods for category management
 */
const categoryController = {
  /**
   * Create New Category
   * Creates a new expense or income category for the authenticated user
   * @route POST /api/categories
   * @access Private (requires authentication)
   */
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    
    // Validate required fields
    if (!name || !type) {
      throw new Error("Name and type are required for creating a category");
    }
    
    // Convert the name to lowercase for consistency
    const normalizedName = name.toLowerCase();
    
    // Validate category type
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid category type" + type);
    }
    
    // Check if category already exists for this user
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      throw new Error(
        `Category ${categoryExists.name} already exists in the database`
      );
    }
    
    // Create the new category
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    
    // Send success response with created category
    res.status(201).json(category);
  }),

  /**
   * Get All Categories
   * Retrieves all categories belonging to the authenticated user
   * @route GET /api/categories
   * @access Private (requires authentication)
   */
  lists: asyncHandler(async (req, res) => {
    // Find all categories for the authenticated user
    const categories = await Category.find({ user: req.user });
    
    // Send categories list
    res.status(200).json(categories);
  }),

  /**
   * Update Category
   * Updates an existing category and propagates changes to related transactions
   * @route PUT /api/categories/:categoryId
   * @access Private (requires authentication)
   */
  update: asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { type, name } = req.body;
    const normalizedName = name.toLowerCase();
    
    // Find the category to update
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      throw new Error("Category not found or user not authorized");
    }
    
    // Store old name for transaction updates
    const oldName = category.name;
    
    // Update category properties
    category.name = normalizedName || category.name;
    category.type = type || category.type;
    const updatedCategory = await category.save();
    
    // Update affected transactions if category name changed
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        { $set: { category: updatedCategory.name } }
      );
    }
    
    // Send updated category
    res.json(updatedCategory);
  }),
  /**
   * Delete Category
   * Deletes a category and updates all related transactions to "Uncategorized"
   * @route DELETE /api/categories/:id
   * @access Private (requires authentication)
   */
  delete: asyncHandler(async (req, res) => {
    // Find the category to delete
    const category = await Category.findById(req.params.id);
    
    // Verify category exists and user is authorized
    if (category && category.user.toString() === req.user.toString()) {
      // Update transactions that have this category to default category
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        { user: req.user, category: category.name },
        { $set: { category: defaultCategory } }
      );
      
      // Remove the category from database
      await Category.findByIdAndDelete(req.params.id);
      
      // Send success response
      res.json({ message: "Category removed and transactions updated" });
    } else {
      // Send error response for unauthorized or not found
      res.json({ message: "Category not found or user not authorized" });
    }
  }),
};

// Export the category controller for use in routes
module.exports = categoryController;
