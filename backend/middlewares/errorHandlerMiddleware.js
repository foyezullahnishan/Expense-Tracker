/**
 * Error Handler Middleware
 * Global error handling middleware for the Express application.
 * Catches and processes all errors that occur during request processing.
 */

/**
 * Error Handler Function
 * Processes errors and sends appropriate error responses to clients
 * 
 * @param {Error} err - The error object containing error details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  // Determine the appropriate HTTP status code
  // If status code is 200 (success), change it to 500 (internal server error)
  // Otherwise, use the existing status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Set the HTTP status code for the response
  res.status(statusCode);
  
  // Send error response as JSON
  res.json({
    message: err.message,  // Error message for the client
    stack: err.stack,      // Error stack trace for debugging
  });
};

// Export the error handler middleware for use in the main application
module.exports = errorHandler;
