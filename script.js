// Load data from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let budget = parseFloat(localStorage.getItem('budget')) || 0;

// DOM Elements
const budgetInput = document.getElementById('budget');
const setBudgetBtn = document.getElementById('set-budget');
const budgetDisplay = document.getElementById('budget-display');
const budgetNotification = document.getElementById('budget-notification');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const addExpenseBtn = document.getElementById('add-expense');
const filterCategory = document.getElementById('filter-category');
const filterDate = document.getElementById('filter-date');
const applyFilterBtn = document.getElementById('apply-filter');
const totalDisplay = document.getElementById('total');
const expensesList = document.getElementById('expenses');

// Initialize app
function init() {
    updateBudgetDisplay();
    renderExpenses();
    checkBudgetNotification();
    // Set default date to today
    dateInput.value = new Date().toISOString().split('T')[0];
}

// Set Budget
setBudgetBtn.addEventListener('click', () => {
    const newBudget = parseFloat(budgetInput.value);
    if (newBudget >= 0) {
        budget = newBudget;
        localStorage.setItem('budget', budget);
        updateBudgetDisplay();
        checkBudgetNotification();
        budgetInput.value = '';
    } else {
        alert('Please enter a valid budget.');
    }
});

// Add Expense
addExpenseBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
    const date = dateInput.value;
    
    if (title && amount > 0 && category && date) {
        const expense = { id: Date.now(), title, amount, category, date };
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        renderExpenses();
        checkBudgetNotification();
        // Clear form (but keep date as today)
        titleInput.value = '';
        amountInput.value = '';
        categorySelect.value = '';
        dateInput.value = new Date().toISOString().split('T')[0]; // Reset to today
    } else {
        alert('Please fill in all fields correctly.');
    }
});

// Delete Expense
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses();
    checkBudgetNotification();
}

// Render Expenses
function renderExpenses(filteredExpenses = expenses) {
    expensesList.innerHTML = '';
    let total = 0;
    filteredExpenses.forEach(exp => {
        total += exp.amount;
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${exp.title}</strong> - ₹${exp.amount.toFixed(2)} - ${exp.category} - ${exp.date}
            </div>
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
        `;
        expensesList.appendChild(li);
    });
    totalDisplay.textContent = total.toFixed(2);
}

// Apply Filter
applyFilterBtn.addEventListener('click', () => {
    const category = filterCategory.value;
    const date = filterDate.value;
    
    let filtered = expenses;
    if (category) {
        filtered = filtered.filter(exp => exp.category === category);
    }
    if (date) {
        filtered = filtered.filter(exp => exp.date >= date);
    }
    renderExpenses(filtered);
});

// Update Budget Display
function updateBudgetDisplay() {
    budgetDisplay.textContent = `Current Budget: ₹${budget.toFixed(2)}`;
}

// Check Budget Notification
function checkBudgetNotification() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    if (budget > 0 && total >= budget * 0.5) {
        budgetNotification.classList.remove('hidden');
    } else {
        budgetNotification.classList.add('hidden');
    }
}

// Initialize on load
init();