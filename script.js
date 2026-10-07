const addExpenseBtn = document.getElementById("addExpenseBtn");
const calculateBtn = document.getElementById("calculateBtn");
const expenseList = document.getElementById("expenseList");

const incomeInput = document.getElementById("income");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const savings = document.getElementById("savings");

const categoryReport = document.getElementById("categoryReport");
const savingsStatus = document.getElementById("savingsStatus");
const errorMessage = document.getElementById("errorMessage");


function createExpenseRow() {

    const row = document.createElement("div");

    row.className = "expense-row";

    row.innerHTML = `
        <input
            type="text"
            class="expense-name"
            placeholder="Expense name"
        >

        <select class="expense-category">
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
        </select>

        <input
            type="number"
            class="expense-amount"
            placeholder="Amount (₹)"
            min="0"
        >

        <button type="button" class="remove-btn">
            Remove
        </button>
    `;

    expenseList.appendChild(row);

    addRemoveButton(row);
}


function addRemoveButton(row) {

    const removeButton = row.querySelector(".remove-btn");

    removeButton.addEventListener("click", function () {

        row.remove();

    });
}


document.querySelectorAll(".remove-btn").forEach(function(button) {

    button.addEventListener("click", function() {

        button.parentElement.remove();

    });

});


addExpenseBtn.addEventListener("click", function() {

    createExpenseRow();

});


calculateBtn.addEventListener("click", function() {

    errorMessage.textContent = "";

    const income = Number(incomeInput.value);

    if (incomeInput.value === "" || income < 0) {

        errorMessage.textContent = "Please enter a valid income.";

        return;
    }


    const expenseRows = document.querySelectorAll(".expense-row");

    let expenseTotal = 0;

    const categories = {};


    for (let i = 0; i < expenseRows.length; i++) {

        const category =
            expenseRows[i]
                .querySelector(".expense-category")
                .value;

        const amount =
            Number(
                expenseRows[i]
                    .querySelector(".expense-amount")
                    .value
            );


        if (category === "" && amount === 0) {
            continue;
        }


        if (category === "") {

            errorMessage.textContent =
                "Please select a category for every expense.";

            return;
        }


        if (amount < 0 || isNaN(amount)) {

            errorMessage.textContent =
                "Please enter valid expense amounts.";

            return;
        }


        expenseTotal += amount;


        if (categories[category]) {

            categories[category] += amount;

        } else {

            categories[category] = amount;

        }

    }


    const savedAmount = income - expenseTotal;


    totalIncome.textContent =
        formatCurrency(income);

    totalExpenses.textContent =
        formatCurrency(expenseTotal);

    savings.textContent =
        formatCurrency(savedAmount);


    displayCategoryReport(categories);

    displaySavingsStatus(savedAmount, income);

});


function displayCategoryReport(categories) {

    categoryReport.innerHTML = "";

    const categoryNames = Object.keys(categories);


    if (categoryNames.length === 0) {

        categoryReport.innerHTML =
            "<p>No expenses entered.</p>";

        return;
    }


    for (let i = 0; i < categoryNames.length; i++) {

        const category = categoryNames[i];

        const amount = categories[category];


        const item = document.createElement("div");

        item.className = "category-item";

        item.innerHTML = `
            <span>${category}</span>
            <span>${formatCurrency(amount)}</span>
        `;

        categoryReport.appendChild(item);

    }

}


function displaySavingsStatus(savedAmount, income) {

    savingsStatus.className = "status";


    if (savedAmount < 0) {

        savingsStatus.textContent =
            "Warning: Your expenses are greater than your income.";

        savingsStatus.classList.add("danger");

    } else if (savedAmount === 0) {

        savingsStatus.textContent =
            "Your income and expenses are equal. You have no savings.";

        savingsStatus.classList.add("warning");

    } else {

        const savingPercentage =
            (savedAmount / income) * 100;


        if (savingPercentage >= 20) {

            savingsStatus.textContent =
                "Great! You are maintaining healthy savings.";

            savingsStatus.classList.add("good");

        } else {

            savingsStatus.textContent =
                "You have savings, but consider reducing unnecessary expenses.";

            savingsStatus.classList.add("warning");

        }

    }

}


function formatCurrency(amount) {

    return "₹" + amount.toFixed(2);

}