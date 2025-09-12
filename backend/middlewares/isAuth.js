/**
 * Authentication Middleware
 * Verifies JWT tokens to protect routes that require user authentication.
 * Extracts user information from valid tokens and attaches it to the request object.
 */

// Import JSON Web Token library for token verification
const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware Function
 * Checks if the user is authenticated by verifying the JWT token
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuthenticated = async (req, res, next) => {
  // Extract the authorization token from request headers
  const headerObj = req.headers;
  // Get token from "Bearer <token>" format in Authorization header
  const token = headerObj?.authorization?.split(" ")[1];
  
  // Verify the JWT token using the secret key
  const verifyToken = jwt.verify(token, "masynctechKey", (err, decoded) => {
    if (err) {
      // Token is invalid or expired
      return false;
    } else {
      // Token is valid, return decoded payload
      return decoded;
    }
  });
  
  if (verifyToken) {
    // Token is valid - attach user ID to request object for use in subsequent middleware/routes
    req.user = verifyToken.id;
    next(); // Continue to next middleware/route handler
  } else {
    // Token is invalid or expired - create error and pass to error handler
    const err = new Error("Token expired, login again");
    next(err);
  }
};

// Export the authentication middleware for use in protected routes
module.exports = isAuthenticated;
