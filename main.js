// GENERAL
const jsBalance = document.querySelector(".js-balance");
const jsTransactions = document.querySelector(".js-transactions");
const jsProgressBar = document.querySelector(".js-progressBarValue");
const jsAddIncomeBtn = document.querySelector(".js-addIncome");
const jsAddExpenseBtn = document.querySelector(".js-addExpense");
const jsOverlay = document.querySelector(".js-overlay");
// POP UP ELEMENTS
// add income
const jsAddIncome = document.getElementById("js-addIncome");
const jsSaveIncome = document.querySelector(".js-saveIncome");
const jsCancelIncome = document.querySelector(".js-cancelIncome");
const jsIncomeTitle = document.querySelector(".js-income-title");
const jsIncomeAmount = document.querySelector(".js-income-amount");
const jsIncomeCategory = document.querySelector(".js-income-category");
// add expense
const jsAddExpense = document.getElementById("js-addExpense");
const jsSaveExpense = document.querySelector(".js-saveExpense");
const jsCancelExpense = document.querySelector(".js-cancelExpense");
const jsExpenseTitle = document.querySelector(".js-expense-title");
const jsExpenseAmount = document.querySelector(".js-expense-amount");
const jsExpenseCategory = document.querySelector(".js-expense-category");

// ADD INCOME/EXPENSE POP UP
const showPopUp = (popup, cancel) => {
  popup.classList.add("active");
  jsOverlay.classList.add("active");

  cancel.addEventListener("click", () => {
    popup.classList.remove("active");
    jsOverlay.classList.remove("active");
  })
}

// income pop up
const showAddIncome = () => {
  showPopUp(jsAddIncome, jsCancelIncome);
}

// expense pop up
const showAddExpense = () => {
  showPopUp(jsAddExpense, jsCancelExpense);
}

// EVENT LISTENERS
jsAddIncomeBtn.addEventListener("click", showAddIncome);
jsAddExpenseBtn.addEventListener("click", showAddExpense);