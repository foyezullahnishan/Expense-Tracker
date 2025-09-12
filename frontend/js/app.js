/**
 * ExpenseTracker - Main application class for managing personal finances
 * Handles user authentication, transaction management, category management,
 * and provides a comprehensive dashboard with charts and analytics
 */
// Expense Tracker Application
class ExpenseTracker {
    /**
     * Initialize the ExpenseTracker application
     * Sets up API configuration, retrieves stored authentication data,
     * and initializes application state
     */
    constructor() {
        // Dynamic API base URL configuration based on current hostname
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const isYourIP = hostname === '192.168.0.109';
        
        // Set API base URL depending on environment
        if (isYourIP) {
            this.API_BASE = 'http://192.168.0.109:8000/api/v1';
        } else {
            this.API_BASE = 'http://localhost:8000/api/v1';
        }
        
        console.log('API Base URL:', this.API_BASE);
        
        // Authentication token retrieved from localStorage
        this.token = localStorage.getItem('token');
        
        // Current authenticated user data retrieved from localStorage
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Array to store user's transactions
        this.transactions = [];
        
        // Array to store user's categories
        this.categories = [];
        
        // Object to store chart instances (pie chart, line chart)
        this.charts = {};
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     * Sets up event listeners and determines initial view based on authentication status
     */
    init() {
        // Set up all event listeners for user interactions
        this.setupEventListeners();
        
        // Check authentication status and show appropriate interface
        this.checkAuthentication();
    }

    // ==================== AUTHENTICATION METHODS ====================
    
    /**
     * Check if user is authenticated and show appropriate interface
     * Verifies token and user data existence, then displays app or landing page
     */
    checkAuthentication() {
        console.log('Checking authentication...', { token: this.token, user: this.user });
        
        // Check if both token and user ID exist
        if (this.token && this.user.id) {
            console.log('User is authenticated, showing app');
            // Show main application interface
            this.showApp();
            // Load user data (transactions, categories)
            this.loadData();
        } else {
            console.log('User not authenticated, showing landing page');
            // Show landing page for non-authenticated users
            this.showLanding();
        }
    }

    // ==================== UI STATE MANAGEMENT ====================
    
    /**
     * Display the landing page (home page for non-authenticated users)
     * Hides authentication and main application interfaces
     */
    showLanding() {
        const landingPage = document.getElementById('landingPage');
        const authContainer = document.getElementById('authContainer');
        const appContainer = document.getElementById('appContainer');
        const topNavbar = document.getElementById('topNavbar');
        const sidebar = document.getElementById('sidebar');
        
        // Show landing page
        landingPage.style.display = 'block';
        landingPage.classList.remove('d-none');
        
        // Hide other containers
        authContainer.style.display = 'none';
        authContainer.classList.add('d-none');
        appContainer.style.display = 'none';
        appContainer.classList.remove('show');
        topNavbar.style.display = 'none';
        topNavbar.classList.remove('show');
        sidebar.style.display = 'none';
        sidebar.classList.remove('show');
    }

    /**
     * Display the authentication page (login/register forms)
     * Hides landing and main application interfaces
     */
    showAuth() {
        const landingPage = document.getElementById('landingPage');
        const authContainer = document.getElementById('authContainer');
        const appContainer = document.getElementById('appContainer');
        const topNavbar = document.getElementById('topNavbar');
        const sidebar = document.getElementById('sidebar');
        
        // Show auth container
        authContainer.style.display = 'block';
        authContainer.classList.remove('d-none');
        
        // Hide other elements
        landingPage.style.display = 'none';
        landingPage.classList.add('d-none');
        appContainer.style.display = 'none';
        appContainer.classList.remove('show');
        topNavbar.style.display = 'none';
        topNavbar.classList.remove('show');
        sidebar.style.display = 'none';
        sidebar.classList.remove('show');
    }

    /**
     * Display the main application interface (for authenticated users)
     * Hides landing and authentication interfaces, shows navigation and sidebar
     */
    showApp() {
        const landingPage = document.getElementById('landingPage');
        const authContainer = document.getElementById('authContainer');
        const appContainer = document.getElementById('appContainer');
        const topNavbar = document.getElementById('topNavbar');
        const sidebar = document.getElementById('sidebar');
        
        // Hide landing page and auth container
        landingPage.style.display = 'none';
        landingPage.classList.add('d-none');
        authContainer.style.display = 'none';
        authContainer.classList.add('d-none');
        
        // Show app elements
        appContainer.style.display = 'block';
        appContainer.classList.add('show');
        topNavbar.style.display = 'block';
        topNavbar.classList.add('show');
        sidebar.style.display = 'flex';
        sidebar.classList.add('show');
        
        // Update user display names in the interface
        if (this.user.username) {
            const userDisplayName = document.getElementById('userDisplayName');
            const sidebarUsername = document.getElementById('sidebarUsername');
            const sidebarEmail = document.getElementById('sidebarEmail');
            
            if (userDisplayName) userDisplayName.textContent = this.user.username;
            if (sidebarUsername) sidebarUsername.textContent = this.user.username;
            if (sidebarEmail) sidebarEmail.textContent = this.user.email;
        }
        
        // Set default view to dashboard and initialize sidebar
        this.showSection('dashboardSection');
        this.setActiveNav('dashboardTab');
        this.initializeSidebar();
    }

    // ==================== USER REGISTRATION & LOGIN ====================
    
    /**
     * Register a new user account
     * @param {Object} userData - User registration data (username, email, password)
     */
    async register(userData) {
        try {
            // Send registration request to API
            const response = await fetch(`${this.API_BASE}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (response.ok) {
                // Registration successful - show success message and redirect to login
                this.showAlert('Registration successful! Please login.', 'success');
                this.showLogin();
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Authenticate user login
     * @param {Object} credentials - User login credentials (email, password)
     */
    async login(credentials) {
        console.log('Login attempt with:', credentials.email);
        try {
            // Send login request to API
            const response = await fetch(`${this.API_BASE}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            console.log('Login response:', { status: response.status, data });
            
            if (response.ok) {
                // Store authentication data in instance and localStorage
                this.token = data.token;
                this.user = {
                    id: data.id,
                    email: data.email,
                    username: data.username
                };
                
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                console.log('Login successful, user data stored:', this.user);
                
                this.showAlert('Login successful!', 'success');
                
                // Small delay to ensure alert is shown before transition
                setTimeout(() => {
                    this.showApp();
                    this.loadData();
                }, 500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Log out the current user
     * Clears all user data, tokens, and resets the application state
     */
    logout() {
        // Clear application state
        this.token = null;
        this.user = {};
        this.transactions = [];
        this.categories = [];
        
        // Remove data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Clear any existing chart instances to prevent memory leaks
        if (this.charts.pie) {
            this.charts.pie.destroy();
            this.charts.pie = null;
        }
        if (this.charts.line) {
            this.charts.line.destroy();
            this.charts.line = null;
        }
        
        // Reset login form fields
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        if (loginForm) {
            const loginEmailInput = document.getElementById('loginEmail');
            const loginPasswordInput = document.getElementById('loginPassword');
            if (loginEmailInput) loginEmailInput.value = '';
            if (loginPasswordInput) loginPasswordInput.value = '';
        }
        
        // Return to authentication page
        this.showAuth();
        this.showLogin();
        this.showAlert('Logged out successfully', 'info');
    }

    // ==================== API HELPER METHODS ====================
    
    /**
     * Make authenticated API requests with automatic token handling
     * @param {string} url - API endpoint URL
     * @param {Object} options - Fetch options (method, body, headers, etc.)
     * @returns {Promise<Response>} - Fetch response
     */
    async makeAuthenticatedRequest(url, options = {}) {
        const response = await fetch(`${this.API_BASE}${url}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                ...options.headers
            }
        });

        // Handle unauthorized access (expired token)
        if (response.status === 401) {
            this.logout();
            throw new Error('Session expired. Please login again.');
        }

        return response;
    }

    // ==================== DATA LOADING METHODS ====================
    
    /**
     * Load all application data (transactions, categories, profile)
     * Called after successful authentication
     */
    async loadData() {
        this.showLoading();
        try {
            // Load all data concurrently for better performance
            await Promise.all([
                this.loadTransactions(),
                this.loadCategories(),
                this.loadProfile()
            ]);
            // Update dashboard with loaded data
            this.updateDashboard();
            this.populateFilters();
        } catch (error) {
            this.showAlert('Error loading data: ' + error.message, 'danger');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Load user's transactions from the API
     */
    async loadTransactions() {
        try {
            const response = await this.makeAuthenticatedRequest('/transactions/lists');
            const data = await response.json();
            
            if (response.ok) {
                // Store transactions and update UI
                this.transactions = data.transactions || data || [];
                this.renderTransactions();
                this.renderRecentTransactions();
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    /**
     * Load user's categories from the API
     */
    async loadCategories() {
        try {
            const response = await this.makeAuthenticatedRequest('/categories/lists');
            const data = await response.json();
            
            if (response.ok) {
                // Store categories and update UI
                this.categories = data.categories || data || [];
                this.renderCategories();
                this.populateCategorySelects();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    /**
     * Load user's profile information from the API
     */
    async loadProfile() {
        try {
            const response = await this.makeAuthenticatedRequest('/users/profile');
            const data = await response.json();
            
            if (response.ok) {
                // Populate profile form fields
                document.getElementById('profileUsername').value = data.username || this.user.username;
                document.getElementById('profileEmail').value = data.email || this.user.email;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }

    // ==================== TRANSACTION MANAGEMENT ====================
    
    /**
     * Create a new transaction
     * @param {Object} transactionData - Transaction data (type, category, amount, date, description)
     */
    async createTransaction(transactionData) {
        try {
            const response = await this.makeAuthenticatedRequest('/transactions/create', {
                method: 'POST',
                body: JSON.stringify(transactionData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Transaction added successfully!', 'success');
                // Refresh data and close modal
                this.loadTransactions();
                this.updateDashboard();
                this.hideModal('transactionModal');
            } else {
                throw new Error(data.message || 'Failed to create transaction');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Update an existing transaction
     * @param {string} id - Transaction ID
     * @param {Object} transactionData - Updated transaction data
     */
    async updateTransaction(id, transactionData) {
        try {
            const response = await this.makeAuthenticatedRequest(`/transactions/update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(transactionData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Transaction updated successfully!', 'success');
                // Refresh data and close modal
                this.loadTransactions();
                this.updateDashboard();
                this.hideModal('transactionModal');
            } else {
                throw new Error(data.message || 'Failed to update transaction');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Delete a transaction
     * @param {string} id - Transaction ID to delete
     */
    async deleteTransaction(id) {
        // Confirm deletion with user
        if (!confirm('Are you sure you want to delete this transaction?')) return;
        
        try {
            const response = await this.makeAuthenticatedRequest(`/transactions/delete/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Transaction deleted successfully!', 'success');
                // Refresh data
                this.loadTransactions();
                this.updateDashboard();
            } else {
                throw new Error(data.message || 'Failed to delete transaction');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    // ==================== CATEGORY MANAGEMENT ====================
    
    /**
     * Create a new category
     * @param {Object} categoryData - Category data (name, type)
     */
    async createCategory(categoryData) {
        try {
            const response = await this.makeAuthenticatedRequest('/categories/create', {
                method: 'POST',
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Category created successfully!', 'success');
                // Refresh categories and close modal
                this.loadCategories();
                this.hideModal('categoryModal');
            } else {
                throw new Error(data.message || 'Failed to create category');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Update an existing category
     * @param {string} id - Category ID
     * @param {Object} categoryData - Updated category data
     */
    async updateCategory(id, categoryData) {
        try {
            const response = await this.makeAuthenticatedRequest(`/categories/update/${id}`, {
                method: 'PUT',
                body: JSON.stringify(categoryData)
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Category updated successfully!', 'success');
                // Refresh categories and close modal
                this.loadCategories();
                this.hideModal('categoryModal');
            } else {
                throw new Error(data.message || 'Failed to update category');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Delete a category
     * @param {string} id - Category ID to delete
     */
    async deleteCategory(id) {
        // Confirm deletion with user
        if (!confirm('Are you sure you want to delete this category?')) return;
        
        try {
            const response = await this.makeAuthenticatedRequest(`/categories/delete/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Category deleted successfully!', 'success');
                // Refresh categories list
                this.loadCategories();
            } else {
                throw new Error(data.message || 'Failed to delete category');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    // ==================== PROFILE MANAGEMENT ====================
    
    /**
     * Update user profile information
     * @param {Object} profileData - Profile data (username, email)
     */
    async updateProfile(profileData) {
        try {
            const response = await this.makeAuthenticatedRequest('/users/update-profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });

            const data = await response.json();
            
            if (response.ok) {
                // Update local user data and localStorage
                this.user.username = profileData.username;
                this.user.email = profileData.email;
                localStorage.setItem('user', JSON.stringify(this.user));
                this.showAlert('Profile updated successfully!', 'success');
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    /**
     * Change user password
     * @param {string} newPassword - New password
     */
    async changePassword(newPassword) {
        try {
            const response = await this.makeAuthenticatedRequest('/users/change-password', {
                method: 'PUT',
                body: JSON.stringify({ newPassword })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('Password changed successfully!', 'success');
                // Reset the password form
                document.getElementById('changePasswordForm').reset();
            } else {
                throw new Error(data.message || 'Failed to change password');
            }
        } catch (error) {
            this.showAlert(error.message, 'danger');
        }
    }

    // ==================== RENDERING METHODS ====================
    
    /**
     * Render transactions table with all user transactions
     * Displays transaction data in a formatted table with edit/delete actions
     */
    renderTransactions() {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;

        // Show empty state if no transactions
        if (this.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No transactions found</td></tr>';
            return;
        }

        // Generate table rows for each transaction
        tbody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td>${this.formatDate(transaction.date || transaction.createdAt)}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>
                    <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
                        ${transaction.category}
                    </span>
                </td>
                <td>
                    <span class="transaction-${transaction.type}">
                        <i class="bi bi-arrow-${transaction.type === 'income' ? 'up' : 'down'}-circle me-1"></i>
                        ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                </td>
                <td class="fw-bold transaction-${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}£${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="app.editTransaction('${transaction._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.deleteTransaction('${transaction._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Render recent transactions table for dashboard
     * Shows the 5 most recent transactions
     */
    renderRecentTransactions() {
        const tbody = document.getElementById('recentTransactionsTable');
        if (!tbody) return;

        // Get the 5 most recent transactions
        const recent = this.transactions.slice(0, 5);
        
        // Show empty state if no transactions
        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No transactions yet</td></tr>';
            return;
        }

        // Generate table rows for recent transactions
        tbody.innerHTML = recent.map(transaction => `
            <tr>
                <td>${this.formatDate(transaction.date || transaction.createdAt)}</td>
                <td>${transaction.description || 'No description'}</td>
                <td>
                    <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
                        ${transaction.category}
                    </span>
                </td>
                <td>
                    <span class="transaction-${transaction.type}">
                        <i class="bi bi-arrow-${transaction.type === 'income' ? 'up' : 'down'}-circle me-1"></i>
                        ${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                </td>
                <td class="fw-bold transaction-${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}£${Math.abs(transaction.amount).toFixed(2)}
                </td>
            </tr>
        `).join('');
    }

    /**
     * Render categories grid with category cards
     * Displays all user categories in a responsive grid layout
     */
    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        if (!container) return;

        // Show empty state if no categories
        if (this.categories.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted">No categories found</div>';
            return;
        }

        // Generate category cards
        container.innerHTML = this.categories.map(category => `
            <div class="col-md-4 col-sm-6 mb-3">
                <div class="category-card ${category.type}">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1 fw-bold">${category.name}</h6>
                            <small class="text-muted">
                                <i class="bi bi-${category.type === 'income' ? 'arrow-up-circle text-success' : 'arrow-down-circle text-danger'} me-1"></i>
                                ${category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                            </small>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="app.editCategory('${category._id}')">
                                    <i class="bi bi-pencil me-2"></i>Edit
                                </a></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="app.deleteCategory('${category._id}')">
                                    <i class="bi bi-trash me-2"></i>Delete
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Dashboard Methods
    updateDashboard() {
        this.updateSummaryCards();
        this.updateCharts();
    }

    updateSummaryCards() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const netBalance = totalIncome - totalExpense;
        const totalTransactions = this.transactions.length;

        document.getElementById('totalIncome').textContent = `£${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpense').textContent = `£${totalExpense.toFixed(2)}`;
        document.getElementById('netBalance').textContent = `£${netBalance.toFixed(2)}`;
        document.getElementById('totalTransactions').textContent = totalTransactions;

        // Update net balance color
        const netBalanceElement = document.getElementById('netBalance');
        const card = netBalanceElement.closest('.card');
        if (netBalance >= 0) {
            card.className = 'card bg-gradient-success text-white h-100';
        } else {
            card.className = 'card bg-gradient-danger text-white h-100';
        }
    }

    updateCharts() {
        this.updatePieChart();
    }

    /**
     * Update the pie chart showing income vs expenses distribution
     * Creates a doughnut chart with income and expense totals
     */
    updatePieChart() {
        const ctx = document.getElementById('pieChart');
        if (!ctx) return;

        // Calculate totals for chart data
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        // Destroy existing chart instance to prevent memory leaks
        if (this.charts.pie) {
            this.charts.pie.destroy();
        }

        // Create new pie chart with Chart.js
        this.charts.pie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [totalIncome, totalExpense],
                    backgroundColor: ['#22c55e', '#ef4444'], // Green for income, red for expenses
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }



    // ==================== UI HELPER METHODS ====================
    
    /**
     * Initialize sidebar functionality and responsive behavior
     * Handles toggle, overlay, and responsive design for mobile/desktop
     */
    initializeSidebar() {
        // Get DOM elements for sidebar functionality
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mainContent = document.querySelector('.main-content');
        const topNavbar = document.getElementById('topNavbar');

        // Handle sidebar toggle button click
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                if (window.innerWidth <= 991) {
                    // Mobile behavior - slide sidebar in/out with overlay
                    sidebar.classList.toggle('show');
                    overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
                    if (sidebar.classList.contains('show')) {
                        setTimeout(() => overlay.classList.add('show'), 10);
                    } else {
                        overlay.classList.remove('show');
                        setTimeout(() => overlay.style.display = 'none', 300);
                    }
                } else {
                    // Desktop behavior - collapse to icon-only sidebar
                    sidebar.classList.toggle('collapsed');
                    if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
                    if (topNavbar) topNavbar.classList.toggle('sidebar-collapsed');
                    
                    // Update toggle button icon based on state
                    const toggleIcon = sidebarToggle.querySelector('i');
                    if (sidebar.classList.contains('collapsed')) {
                        toggleIcon.className = 'bi bi-chevron-right';
                    } else {
                        toggleIcon.className = 'bi bi-list';
                    }
                }
            });
        }

        // Close sidebar when overlay is clicked (mobile only)
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
                setTimeout(() => overlay.style.display = 'none', 300);
            });
        }

        // Handle responsive behavior on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                // Desktop - remove mobile classes and reset state
                sidebar.classList.remove('show');
                overlay.style.display = 'none';
                overlay.classList.remove('show');
            } else {
                // Mobile - remove desktop collapsed state
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('sidebar-collapsed');
                if (topNavbar) topNavbar.classList.remove('sidebar-collapsed');
                
                // Reset toggle button icon
                const toggleIcon = sidebarToggle?.querySelector('i');
                if (toggleIcon) {
                    toggleIcon.className = 'bi bi-list';
                }
            }
        });

        // Additional resize handler for cleanup (duplicate but kept for safety)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                sidebar.classList.remove('show');
                overlay.style.display = 'none';
                overlay.classList.remove('show');
            }
        });
    }

    /**
     * Populate category select dropdowns with available categories
     * Updates both transaction form and filter dropdowns
     */
    populateCategorySelects() {
        const selects = ['transactionCategory', 'filterCategory'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            // Store current value to restore after repopulating
            const currentValue = select.value;
            const isFilter = selectId.includes('filter');
            
            // Set default option based on select type
            select.innerHTML = isFilter ? '<option value="">All Categories</option>' : '<option value="">Select Category</option>';
            
            // Add all categories as options
            this.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = `${category.name} (${category.type})`;
                select.appendChild(option);
            });
            
            // Restore previous selection if it still exists
            if (currentValue) {
                select.value = currentValue;
            }
        });
    }

    /**
     * Populate all filter dropdowns with current data
     * Currently only populates category filters
     */
    populateFilters() {
        this.populateCategorySelects();
    }

    /**
     * Show a specific section and hide all others
     * @param {string} sectionId - ID of the section to display
     */
    showSection(sectionId) {
        // Hide all sections first
        const sections = document.querySelectorAll('.section-content');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the requested section
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }

    /**
     * Set active navigation item in sidebar
     * @param {string} tabId - ID of the navigation tab to activate
     */
    setActiveNav(tabId) {
        // Remove active class from all sidebar navigation links
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to the selected navigation link
        const activeLink = document.getElementById(tabId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Close mobile sidebar if currently open
     * Used when navigating to prevent sidebar staying open on mobile
     */
    closeMobileSidebar() {
        if (window.innerWidth <= 991) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => overlay.style.display = 'none', 300);
        }
    }

    /**
     * Show a Bootstrap modal
     * @param {string} modalId - ID of the modal to display
     */
    showModal(modalId) {
        const modal = new bootstrap.Modal(document.getElementById(modalId));
        modal.show();
    }

    /**
     * Hide a Bootstrap modal
     * @param {string} modalId - ID of the modal to hide
     */
    hideModal(modalId) {
        const modalElement = document.getElementById(modalId);
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }

    /**
     * Display a toast notification to the user
     * @param {string} message - Message to display
     * @param {string} type - Type of alert (success, danger, warning, info)
     */
    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'toast-' + Date.now();
        
        // Create toast HTML with appropriate styling
        const toastHtml = `
            <div id="${alertId}" class="toast professional-toast toast-${type}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <div class="toast-icon me-2">
                        <i class="bi bi-${this.getAlertIcon(type)}"></i>
                    </div>
                    <strong class="me-auto toast-title">${this.getAlertTitle(type)}</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        // Add toast to container
        alertContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Initialize and show the toast with auto-dismiss
        const toastElement = document.getElementById(alertId);
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3500 // Auto-dismiss after 3.5 seconds
        });
        toast.show();
        
        // Remove toast element after it's hidden to prevent DOM buildup
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
        
        // Add fade out animation before auto-dismiss
        setTimeout(() => {
            if (toastElement && toastElement.parentNode) {
                toastElement.classList.add('toast-fade-out');
            }
        }, 3000);
    }

    /**
     * Get appropriate title for alert type
     * @param {string} type - Alert type
     * @returns {string} - Title for the alert
     */
    getAlertTitle(type) {
        const titles = {
            success: 'Success',
            danger: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || 'Notification';
    }

    /**
     * Get appropriate icon for alert type
     * @param {string} type - Alert type
     * @returns {string} - Bootstrap icon class name
     */
    getAlertIcon(type) {
        const icons = {
            success: 'check-circle',
            danger: 'exclamation-triangle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * Show loading spinner
     * Displays loading indicator during data operations
     */
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.remove('d-none');
        }
    }

    /**
     * Hide loading spinner
     * Hides loading indicator after data operations complete
     */
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.add('d-none');
        }
    }

    /**
     * Show login form and hide register form
     * Switches authentication interface to login mode
     */
    showLogin() {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    }

    /**
     * Show register form and hide login form
     * Switches authentication interface to registration mode
     */
    showRegister() {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }

    // ==================== EDIT METHODS ====================
    
    /**
     * Edit an existing transaction
     * Populates the transaction modal with existing data for editing
     * @param {string} id - Transaction ID to edit
     */
    editTransaction(id) {
        // Find the transaction by ID
        const transaction = this.transactions.find(t => t._id === id);
        if (!transaction) return;

        // Populate modal form with transaction data
        document.getElementById('transactionModalTitle').textContent = 'Edit Transaction';
        document.getElementById('transactionId').value = id;
        document.getElementById('transactionType').value = transaction.type;
        document.getElementById('transactionCategory').value = transaction.category;
        document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
        document.getElementById('transactionDate').value = this.formatDateForInput(transaction.date || transaction.createdAt);
        document.getElementById('transactionDescription').value = transaction.description || '';

        // Show the modal
        this.showModal('transactionModal');
    }

    /**
     * Edit an existing category
     * Populates the category modal with existing data for editing
     * @param {string} id - Category ID to edit
     */
    editCategory(id) {
        // Find the category by ID
        const category = this.categories.find(c => c._id === id);
        if (!category) return;

        // Populate modal form with category data
        document.getElementById('categoryModalTitle').textContent = 'Edit Category';
        document.getElementById('categoryId').value = id;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryType').value = category.type;

        // Show the modal
        this.showModal('categoryModal');
    }

    // ==================== UTILITY METHODS ====================
    
    /**
     * Format date for display in tables
     * @param {string} dateString - ISO date string
     * @returns {string} - Formatted date string
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Format date for HTML date input fields
     * @param {string} dateString - ISO date string
     * @returns {string} - Date string in YYYY-MM-DD format
     */
    formatDateForInput(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    // ==================== FILTER METHODS ====================
    
    /**
     * Filter categories by transaction type
     * Updates the category dropdown to show only categories matching the selected type
     * @param {string} type - Transaction type ('income' or 'expense')
     */
    filterCategoriesByType(type) {
        const categorySelect = document.getElementById('transactionCategory');
        if (!categorySelect) return;

        // Reset dropdown with default option
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        // Filter categories based on type, or show all if no type selected
        const filteredCategories = type ? 
            this.categories.filter(cat => cat.type === type) : 
            this.categories;

        // Populate dropdown with filtered categories
        filteredCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    /**
     * Apply filters to the transactions table
     * Filters transactions based on type, category, and date range
     */
    applyFilters() {
        // Start with all transactions
        let filteredTransactions = [...this.transactions];

        // Get filter values from form inputs
        const typeFilter = document.getElementById('filterType')?.value;
        const categoryFilter = document.getElementById('filterCategory')?.value;
        const startDateFilter = document.getElementById('filterStartDate')?.value;
        const endDateFilter = document.getElementById('filterEndDate')?.value;

        // Apply type filter if selected
        if (typeFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
        }

        // Apply category filter if selected
        if (categoryFilter) {
            filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
        }

        // Apply start date filter if selected
        if (startDateFilter) {
            const startDate = new Date(startDateFilter);
            filteredTransactions = filteredTransactions.filter(t => 
                new Date(t.date || t.createdAt) >= startDate
            );
        }

        // Apply end date filter if selected
        if (endDateFilter) {
            const endDate = new Date(endDateFilter);
            endDate.setHours(23, 59, 59, 999); // Include entire end date
            filteredTransactions = filteredTransactions.filter(t => 
                new Date(t.date || t.createdAt) <= endDate
            );
        }

        // Temporarily replace transactions with filtered results for rendering
        const originalTransactions = this.transactions;
        this.transactions = filteredTransactions;
        this.renderTransactions();
        this.transactions = originalTransactions; // Restore original data
    }

    // ==================== EVENT LISTENERS SETUP ====================
    
    /**
     * Set up all event listeners for the application
     * Handles navigation, forms, modals, and user interactions
     */
    setupEventListeners() {
        // ==================== LANDING PAGE NAVIGATION ====================
        
        // Login button on landing page header
        document.getElementById('landingLoginBtn')?.addEventListener('click', () => {
            this.showAuth();
        });

        // Signup button on landing page header
        document.getElementById('landingSignupBtn')?.addEventListener('click', () => {
            this.showAuth();
            this.showRegister();
        });

        // Get Started button in hero section
        document.getElementById('heroGetStartedBtn')?.addEventListener('click', () => {
            this.showAuth();
            this.showRegister();
        });

        // Learn More button in hero section - smooth scroll to features
        document.getElementById('heroLearnMoreBtn')?.addEventListener('click', () => {
            document.querySelector('.features-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });

        // Get Started button in call-to-action section
        document.getElementById('ctaGetStartedBtn')?.addEventListener('click', () => {
            this.showAuth();
            this.showRegister();
        });

        // ==================== BACK TO LANDING PAGE BUTTONS ====================
        
        // Back button from login form
        document.getElementById('backToLandingFromLogin')?.addEventListener('click', () => {
            this.showLanding();
        });

        // Back button from register form
        document.getElementById('backToLandingFromRegister')?.addEventListener('click', () => {
            this.showLanding();
        });

        // Back button from auth container
        document.getElementById('backToLandingFromAuth')?.addEventListener('click', () => {
            this.showLanding();
        });

        // ==================== AUTHENTICATION FORMS ====================
        
        // Login form submission
        document.getElementById('loginFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values and validate
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!email || !password) {
                this.showAlert('Please fill in all fields', 'warning');
                return;
            }
            
            // Attempt login
            this.login({ email, password });
        });

        // Registration form submission
        document.getElementById('registerFormElement')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values and validate
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            
            if (!username || !email || !password) {
                this.showAlert('Please fill in all fields', 'warning');
                return;
            }
            
            // Attempt registration
            this.register({ username, email, password });
        });

        // Switch to register form link
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegister();
        });

        // Switch to login form link
        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLogin();
        });

        // Logout button in navbar
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // ==================== SIDEBAR NAVIGATION ====================
        
        // Dashboard navigation tab
        document.getElementById('dashboardTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('dashboardSection');
            this.setActiveNav('dashboardTab');
            this.closeMobileSidebar();
        });

        // Transactions navigation tab
        document.getElementById('transactionsTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('transactionsSection');
            this.setActiveNav('transactionsTab');
            this.closeMobileSidebar();
        });

        // Categories navigation tab
        document.getElementById('categoriesTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('categoriesSection');
            this.setActiveNav('categoriesTab');
            this.closeMobileSidebar();
        });

        // Profile navigation tab from sidebar
        document.getElementById('profileTab')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('profileSection');
            this.setActiveNav('profileTab');
            this.closeMobileSidebar();
        });

        // Profile navigation from navbar dropdown
        document.getElementById('profileTabFromNav')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showSection('profileSection');
            this.setActiveNav('profileTab');
        });

        // ==================== TRANSACTION MODAL ====================
        
        // Add Transaction button (primary)
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
            // Reset modal for new transaction
            document.getElementById('transactionModalTitle').textContent = 'Add Transaction';
            document.getElementById('transactionForm').reset();
            document.getElementById('transactionId').value = '';
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            this.showModal('transactionModal');
        });

        // Add Transaction button (secondary)
        document.getElementById('addTransactionBtn2')?.addEventListener('click', () => {
            // Reset modal for new transaction
            document.getElementById('transactionModalTitle').textContent = 'Add Transaction';
            document.getElementById('transactionForm').reset();
            document.getElementById('transactionId').value = '';
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            this.showModal('transactionModal');
        });

        // Save Transaction button in modal
        document.getElementById('saveTransaction')?.addEventListener('click', () => {
            const form = document.getElementById('transactionForm');
            
            // Collect form data
            const transactionData = {
                type: document.getElementById('transactionType').value,
                category: document.getElementById('transactionCategory').value,
                amount: parseFloat(document.getElementById('transactionAmount').value),
                date: document.getElementById('transactionDate').value,
                description: document.getElementById('transactionDescription').value
            };

            // Validate required fields
            if (!transactionData.type || !transactionData.category || !transactionData.amount) {
                this.showAlert('Please fill in required fields', 'warning');
                return;
            }

            // Determine if this is an edit or create operation
            const transactionId = document.getElementById('transactionId').value;
            if (transactionId) {
                this.updateTransaction(transactionId, transactionData);
            } else {
                this.createTransaction(transactionData);
            }
        });

        // ==================== CATEGORY MODAL ====================
        
        // Save Category button in modal
        document.getElementById('saveCategory')?.addEventListener('click', () => {
            // Collect form data
            const categoryData = {
                name: document.getElementById('categoryName').value,
                type: document.getElementById('categoryType').value
            };

            // Validate required fields
            if (!categoryData.name || !categoryData.type) {
                this.showAlert('Please fill in all fields', 'warning');
                return;
            }

            // Determine if this is an edit or create operation
            const categoryId = document.getElementById('categoryId').value;
            if (categoryId) {
                this.updateCategory(categoryId, categoryData);
            } else {
                this.createCategory(categoryData);
            }
        });

        // ==================== PROFILE FORMS ====================
        
        // Update Profile form submission
        document.getElementById('updateProfileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form data
            const profileData = {
                username: document.getElementById('profileUsername').value,
                email: document.getElementById('profileEmail').value
            };
            
            // Validate required fields
            if (!profileData.username || !profileData.email) {
                this.showAlert('Please fill in all fields', 'warning');
                return;
            }
            
            // Update profile
            this.updateProfile(profileData);
        });

        // Change Password form submission
        document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            
            // Validate password field
            if (!newPassword) {
                this.showAlert('Please enter a new password', 'warning');
                return;
            }
            
            // Change password
            this.changePassword(newPassword);
        });

        // ==================== FILTER CONTROLS ====================
        
        // Set up change listeners for all filter controls
        const filters = ['filterType', 'filterCategory', 'filterStartDate', 'filterEndDate'];
        filters.forEach(filterId => {
            document.getElementById(filterId)?.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // ==================== TRANSACTION TYPE CHANGE ====================
        
        // Filter categories when transaction type changes
        document.getElementById('transactionType')?.addEventListener('change', (e) => {
            this.filterCategoriesByType(e.target.value);
        });
    }
}

// ==================== APPLICATION INITIALIZATION ====================

/**
 * Initialize the ExpenseTracker application when DOM is fully loaded
 * Creates a global app instance for access from inline event handlers
 */
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ExpenseTracker();
});

// ==================== GLOBAL FUNCTIONS ====================

/**
 * Global functions for inline event handlers in HTML
 * These provide access to app methods from onclick attributes
 */
window.editTransaction = (id) => window.app.editTransaction(id);
window.deleteTransaction = (id) => window.app.deleteTransaction(id);
window.editCategory = (id) => window.app.editCategory(id);
window.deleteCategory = (id) => window.app.deleteCategory(id);
