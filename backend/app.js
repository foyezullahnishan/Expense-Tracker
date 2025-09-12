/**
 * Expense Tracker Application - Main Server File
 * This file sets up the Express server with all necessary middleware,
 * database connection, routes, and error handling for the expense tracker application.
 */

// Import required dependencies
const express = require("express"); // Express framework for building web applications
const mongoose = require("mongoose"); // MongoDB object modeling tool
const cors = require("cors"); // Cross-Origin Resource Sharing middleware

// Import custom route handlers
const userRouter = require("./routes/userRouter"); // User authentication and management routes
const categoryRouter = require("./routes/categoryRouter"); // Category management routes
const transactionRouter = require("./routes/transactionRouter"); // Transaction management routes

// Import custom middleware
const errorHandler = require("./middlewares/errorHandlerMiddleware"); // Global error handling middleware

// Initialize Express application
const app = express();

/**
 * Database Connection
 * Connect to MongoDB database using Mongoose
 * Database: expense-trackeer on localhost:27017
 */
mongoose
  .connect("mongodb://localhost:27017/expense-tracker")
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((error) => console.log("❌ Database Connection Error:", error));

/**
 * CORS Configuration
 * Configure Cross-Origin Resource Sharing to allow frontend applications
 * to communicate with this backend API from different origins
 */
const corsOptions = {
  // Allowed origins for frontend applications
  origin: [
    'http://localhost:3000',      // React development server
    'http://127.0.0.1:3000',      // Alternative localhost
    'http://192.168.0.109:3000',  // Local network access
    'http://localhost:8080',      // Alternative port
    'http://127.0.0.1:8080',      // Alternative localhost
    'http://192.168.0.109:8080',  // Local network access
    'http://localhost:5500',      // Live Server extension
    'http://127.0.0.1:5500',      // Alternative localhost
    'http://192.168.0.109:5500'   // Local network access
  ],
  credentials: true, // Allow cookies and authentication headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
};

// Apply CORS middleware
app.use(cors(corsOptions));
/**
 * Global Middleware Configuration
 */
// Parse incoming JSON requests
app.use(express.json()); // Enables parsing of JSON payloads in request body

/**
 * API Routes Configuration
 * All routes are mounted at the root level ("/")
 */
app.use("/", userRouter);        // User authentication and profile routes
app.use("/", categoryRouter);    // Category CRUD operations routes
app.use("/", transactionRouter); // Transaction CRUD operations routes

/**
 * Error Handling Middleware
 * This must be the last middleware to catch all errors
 */
app.use(errorHandler);

/**
 * Server Configuration and Startup
 * Start the Express server on specified port and host
 */
const PORT = process.env.PORT || 8000; // Use environment port or default to 8000
const HOST = '0.0.0.0'; // Listen on all network interfaces for accessibility

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Expense Tracker Server is running on http://${HOST}:${PORT}`);
  console.log(`📱 Frontend can access the API from the configured CORS origins`);
});
