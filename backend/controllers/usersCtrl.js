/**
 * User Controller Module
 * Handles all user-related operations including authentication, profile management,
 * and password management for the expense tracker application.
 */

// Import required dependencies
const asyncHandler = require("express-async-handler"); // Async error handling wrapper
const bcrypt = require("bcryptjs"); // Password hashing library
const jwt = require("jsonwebtoken"); // JSON Web Token for authentication
const User = require("../model/User"); // User model for database operations

/**
 * Users Controller Object
 * Contains all controller methods for user management
 */
const usersController = {
  /**
   * User Registration
   * Creates a new user account with hashed password
   * @route POST /api/users/register
   * @access Public
   */
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      throw new Error("Please all fields are required");
    }
    
    // Check if user already exists with this email
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }
    
    // Hash the user password for security
    const salt = await bcrypt.genSalt(10); // Generate salt with complexity 10
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user and save to database
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    // Send success response with user data (excluding password)
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),
  /**
   * User Login
   * Authenticates user credentials and returns JWT token
   * @route POST /api/users/login
   * @access Public
   */
  login: asyncHandler(async (req, res) => {
    // Extract login credentials from request body
    const { email, password } = req.body;
    
    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid login credentials");
    }
    
    // Compare provided password with hashed password in database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    
    // Generate JWT token for authenticated user
    const token = jwt.sign({ id: user._id }, "masynctechKey", {
      expiresIn: "30d", // Token expires in 30 days
    });
    
    // Send success response with token and user data
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  /**
   * Get User Profile
   * Retrieves authenticated user's profile information
   * @route GET /api/users/profile
   * @access Private (requires authentication)
   */
  profile: asyncHandler(async (req, res) => {
    // Find user by ID from authenticated request
    console.log(req.user); // Debug log for user ID
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Send user profile data (excluding sensitive information)
    res.json({ 
      username: user.username, 
      email: user.email 
    });
  }),
  /**
   * Change User Password
   * Updates the authenticated user's password with proper hashing
   * @route PUT /api/users/change-password
   * @access Private (requires authentication)
   */
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    
    // Find the authenticated user
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Hash the new password before saving for security
    const salt = await bcrypt.genSalt(10); // Generate salt with complexity 10
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    
    // Save updated user with new password
    await user.save({
      validateBeforeSave: false, // Skip validation to avoid conflicts
    });
    
    // Send success response
    res.json({ message: "Password Changed successfully" });
  }),
  /**
   * Update User Profile
   * Updates the authenticated user's profile information (username and email)
   * @route PUT /api/users/update-profile
   * @access Private (requires authentication)
   */
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    
    // Update user profile with new information
    const updatedUser = await User.findByIdAndUpdate(
      req.user, // User ID from authentication middleware
      {
        username,
        email,
      },
      {
        new: true, // Return updated document
      }
    );
    
    // Send success response with updated user data
    res.json({ 
      message: "User profile updated successfully", 
      updatedUser 
    });
  }),
};

// Export the users controller for use in routes
module.exports = usersController;
