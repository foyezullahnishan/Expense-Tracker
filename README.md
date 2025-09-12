# 💰 Expense Tracker Application

A comprehensive personal finance management application built with Node.js backend and vanilla JavaScript frontend. This project was developed as part of a Master's Final Year Project to demonstrate full-stack web development skills and modern financial management solutions. Track your income, expenses, and manage your financial categories with beautiful charts and analytics.

![Expense Tracker](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Bootstrap](https://img.shields.io/badge/UI-Bootstrap_5-purple)

## 🚀 Features

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes

### 💳 Transaction Management
- Add, edit, and delete transactions
- Categorize income and expenses
- Date-based filtering
- Real-time balance calculation

### 📊 Analytics & Visualization
- Interactive pie charts for expense breakdown
- Line charts for spending trends
- Monthly/yearly financial summaries
- Category-wise spending analysis

### 📱 User Experience
- Responsive design for all devices
- Modern Bootstrap 5 UI with Shadcn-inspired color palette
- Intuitive sidebar navigation
- Real-time data updates
- Mobile-optimized interface
- Cross-platform compatibility

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Vanilla JavaScript** - Core functionality
- **Bootstrap 5** - UI framework
- **Chart.js** - Data visualization
- **Bootstrap Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)
- [Git](https://git-scm.com/)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/foyezullahnishan/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
node app.js
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Serve the frontend (choose one method)

# Option 1: Using Python
python -m http.server 3000

# Option 2: Using Node.js
npx serve . -p 3000

# Option 3: Using VS Code Live Server extension
# Right-click on index.html and select "Open with Live Server"
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
expense-tracker-app/
├── backend/
│   ├── controllers/
│   │   ├── categoryCtrl.js      # Category management logic
│   │   ├── transactionCtrl.js   # Transaction operations
│   │   └── usersCtrl.js         # User authentication
│   ├── middlewares/
│   │   ├── errorHandlerMiddleware.js
│   │   └── isAuth.js            # JWT authentication middleware
│   ├── model/
│   │   ├── Category.js          # Category schema
│   │   ├── Transaction.js       # Transaction schema
│   │   └── User.js              # User schema
│   ├── routes/
│   │   ├── categoryRouter.js    # Category API routes
│   │   ├── transactionRouter.js # Transaction API routes
│   │   └── userRouter.js        # User API routes
│   ├── app.js                   # Express app configuration
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css            # Custom styles
│   ├── js/
│   │   └── app.js               # Main application logic
│   ├── images/
│   │   └── hero.png
│   └── index.html               # Main HTML file
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `POST /api/v1/transactions` - Create new transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create new category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

## 🎨 Key Features Preview

### 💼 Dashboard Overview
- Real-time balance display
- Quick transaction entry
- Recent transactions list
- Monthly spending summary

### 📊 Analytics & Reports
- Interactive pie charts for expense categories
- Monthly spending trends
- Income vs expense comparison
- Category-wise breakdown

### 📱 Mobile Access
- Fully responsive design
- Touch-friendly interface
- Optimized for mobile browsers
- Progressive Web App features







## 👨‍💻 Author

**Foyez Nishan**
- GitHub: [@foyezullahnishan](https://github.com/foyezullahnishan)
- Project Repository: [Expense-Tracker](https://github.com/foyezullahnishan/Expense-Tracker)
- Email: foyez.nishan@gmail.com
- Academic Project: Master's Final Year Project

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the web framework

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Ensure MongoDB is running locally or check your MongoDB Atlas connection
- Verify all environment variables are set correctly
- Check if port 8000 is available

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check CORS settings in backend/app.js
- Verify API base URL in frontend/js/app.js

**Authentication issues:**
- Clear browser localStorage and cookies
- Check JWT_SECRET environment variable
- Ensure passwords meet minimum requirements

### Database Configuration
The application uses MongoDB with the connection string configured in `backend/app.js`. Make sure MongoDB is running locally on the default port 27017.

## 📞 Support

If you have any questions or need help, please:
1. Contact me directly via email

---

⭐ **Star this repository if you found it helpful!** ⭐
