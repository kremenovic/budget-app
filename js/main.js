// SELECT ELEMENT
function getElement(selection) {
  const element = document.querySelector(selection);
  if (element) {
    return element;
  }
  throw new Error(
    `Please check "${selection}" selector, no such element exists`
  );
}

// for ID
let date = new Date();
let time = date.getTime();
let id = time;

const addIncomeBtn = getElement(".js-btnAddIncome");
const addExpenseBtn = getElement(".js-btnAddExpense");
const transactions = getElement(".js-transactions");
const saveBtn = getElement(".js-save");
const closeBtn = getElement(".js-cancel");
const balance = getElement(".js-balance");
const income = getElement(".js-income");
const expense = getElement(".js-expense");
const progressBar = getElement(".js-progressBarValue");
const chartClothes = getElement(".js-chart-clothes");
const chartGifts = getElement(".js-chart-gifts");
const chartShopping = getElement(".js-chart-shopping");
const chartEatingOut = getElement(".js-chart-eatingOut");
const chartSports = getElement(".js-chart-sports");
const noTransactions = getElement(".js-noTransactions");

// ADD TRANSACTION

class Transactions {
  constructor(element) {
    this.openBtns = element;
    this.overlay = getElement(".js-overlay");
    this.incomeModal = getElement(".js-modal");
    // bind
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(target) {
    this.incomeModal.classList.add("active");
    this.overlay.classList.add("active");
    this.modalTitle = this.incomeModal.querySelector(".js-modalTitle");
    this.modalCategories = this.incomeModal.querySelector(".js-category");
    
    if(target.classList.contains("js-btnAddIncome")) {
      this.modalTitle.innerHTML = "Add Income";
      this.modalCategories.innerHTML = `<option value="Income">Income</option>`;

    } else if (target.classList.contains("js-btnAddExpense")) {
      this.modalTitle.innerHTML = "Add Expense";
      this.modalCategories.innerHTML = `<option value="select" disabled selected>Select...</option>
      <option value="Clothes">Clothes</option>
      <option value="Gifts">Gifts</option>
      <option value="Shopping">Shopping</option>
      <option value="EatingOut">Eating out</option>
      <option value="Sports">Sports</option>`;
    }
  }

  closeModal(target) {
    target.parentElement.parentElement.classList.remove("active");
    this.overlay.classList.remove("active");
  }

  saveTransaction(target) {
    let modal = target.parentElement.parentElement;
    let transactionID = id += 1;
    this.title = modal.querySelector(".js-title");
    this.amount = modal.querySelector(".js-amount");
    this.category = modal.querySelector(".js-category");
    const title = this.title.value;
    const value = this.amount.value;

    if (this.category.value !== "select") {
      if (this.title.value !== "" && this.amount.value !== "") {
        // this.createElement(transactionID, this.category.value, this.title.value, this.category.value, this.amount.value);
        this.addToFirebase(parseInt(transactionID), this.category.value, title, parseInt(value));
        this.closeModal(target);
        this.backToDefault(this.title, this.amount);
      } else {
        alert("You cannot add empty value...");
      }
    } else {
      alert("Please select category...");
    }
    
  }

  createElement(id, categoryName, title, category, amount) {
    let item = document.createElement("li");
    if(categoryName == "Income") {
      item.classList.add("income");
    } else {
      item.classList.add("expense");
    }

    item.setAttribute("data-id", id);
    item.innerHTML = `${category} | ${title}<span class="amount">$${amount} <i class="far fa-trash-alt js-trash"></i></span>`;
    transactions.appendChild(item);

    let trash = item.querySelector(".js-trash");
    trash.addEventListener("click", e => {
      let trashID = e.target.parentElement.parentElement.dataset.id;
      auth.onAuthStateChanged(user => {
        if (user) {
          db.collection('transactions').doc(trashID).delete();
        }
      })
    })
  }

  addToFirebase(id, category, title, value) {
    if(category === "Income") {
      auth.onAuthStateChanged(user => {
        if (user) {
          db.collection('transactions').doc("_" + id).set({
            id: "_" + id,
            user: user.uid,
            type: "income",
            title: title,
            value: value,
            category: category
          })
        }
      })
    } else {
      auth.onAuthStateChanged(user => {
        if (user) {
          db.collection('transactions').doc("_" + id).set({
            id: "_" + id,
            user: user.uid,
            type: "expense",
            title: title,
            value: value,
            category: category
          })
        }
      })
    }
  }

  backToDefault (title, amount) {
    title.value = "";
    amount.value = "";
  }
}

// FIREBASE 

auth.onAuthStateChanged(user => {
  
  // check authentication
  if (!user) {
    location = 'index.html';
  }

  let allIncomes = [];
  let sumIncomes = 0;
  let allExpenses = [];
  let sumExpenses = 0;
  let balanceValue = 0;

  let allClothes = [];
  let sumClothes = 0;
  let allGifts = [];
  let sumGifts = 0;
  let allShopping = [];
  let sumShopping = 0;
  let allEating = [];
  let sumEating = 0;
  let allSports = [];
  let sumSports = 0;

  db.collection("transactions").where("user", "==", user.uid).orderBy("id").onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      if(change.type == "added") {
        // add to transactions
        transaction.createElement(change.doc.data().id, change.doc.data().category, change.doc.data().title, change.doc.data().category, change.doc.data().value);
        // get expense
        if(change.doc.data().type == "expense") {
          allExpenses.push(parseInt(change.doc.data().value));
          sumExpenses = allExpenses.reduce((a, b) => a + b, 0);
          expense.innerHTML = `$${sumExpenses}`;
          // get income
        } else if(change.doc.data().type == "income") {
          allIncomes.push(parseInt(change.doc.data().value));
          sumIncomes = allIncomes.reduce((a, b) => a + b, 0);
          income.innerHTML = `$${sumIncomes}`;
        }
        // update categories
        switch(change.doc.data().category) {
          case "Clothes":
            allClothes.push(parseInt(change.doc.data().value));
            sumClothes = allClothes.reduce((a, b) => a + b, 0);
            chartClothes.innerHTML = `$${sumClothes}`;
            updateChartValues(sumClothes, 0);
            break;
          case "Gifts":
            allGifts.push(parseInt(change.doc.data().value));
            sumGifts = allGifts.reduce((a, b) => a + b, 0);
            chartGifts.innerHTML = `$${sumGifts}`;
            updateChartValues(sumGifts, 1);
            break;
          case "Shopping":
            allShopping.push(parseInt(change.doc.data().value));
            sumShopping = allShopping.reduce((a, b) => a + b, 0);
            chartShopping.innerHTML = `$${sumShopping}`;
            updateChartValues(sumShopping, 2);
            break;
          case "EatingOut":
            allEating.push(parseInt(change.doc.data().value));
            sumEating = allEating.reduce((a, b) => a + b, 0);
            chartEatingOut.innerHTML = `$${sumEating}`;
            updateChartValues(sumEating, 3);
            break;
          case "Sports":
            allSports.push(parseInt(change.doc.data().value));
            sumSports = allSports.reduce((a, b) => a + b, 0);
            chartSports.innerHTML = `$${sumSports}`;
            updateChartValues(sumSports, 4);
        }
        balanceValue = sumIncomes - sumExpenses;
        updateBalance(balanceValue);
        calculateProgressBar(sumIncomes, sumExpenses);
        checkTransactionsCount();
      } else if (change.type == "removed") {
        let removedLi = transactions.querySelector("[data-id=" + change.doc.id + "]");
        transactions.removeChild(removedLi);
         // get expense
         if(change.doc.data().type == "expense") {
          allExpenses.pop(parseInt(change.doc.data().value));
          sumExpenses = allExpenses.reduce((a, b) => a + b, 0);
          expense.innerHTML = `$${sumExpenses}`;
          // get income
        } else if(change.doc.data().type == "income") {
          allIncomes.pop(parseInt(change.doc.data().value));
          sumIncomes = allIncomes.reduce((a, b) => a + b, 0);
          income.innerHTML = `$${sumIncomes}`;
        }
        // update categories
        switch(change.doc.data().category) {
          case "Clothes":
            allClothes.pop(parseInt(change.doc.data().value));
            sumClothes = allClothes.reduce((a, b) => a + b, 0);
            chartClothes.innerHTML = `$${sumClothes}`;
            updateChartValues(sumClothes, 0);
            break;
          case "Gifts":
            allGifts.pop(parseInt(change.doc.data().value));
            sumGifts = allGifts.reduce((a, b) => a + b, 0);
            chartGifts.innerHTML = `$${sumGifts}`;
            updateChartValues(sumGifts, 1);
            break;
          case "Shopping":
            allShopping.pop(parseInt(change.doc.data().value));
            sumShopping = allShopping.reduce((a, b) => a + b, 0);
            console.log(sumShopping);
            chartShopping.innerHTML = `$${sumShopping}`;
            updateChartValues(sumShopping, 2);
            break;
          case "EatingOut":
            allEating.pop(parseInt(change.doc.data().value));
            sumEating = allEating.reduce((a, b) => a + b, 0);
            chartEatingOut.innerHTML = `$${sumEating}`;
            updateChartValues(sumEating, 3);
            break;
          case "Sports":
            allSports.pop(parseInt(change.doc.data().value));
            sumSports = allSports.reduce((a, b) => a + b, 0);
            chartSports.innerHTML = `$${sumSports}`;
            updateChartValues(sumSports, 4);
        }
        balanceValue = sumIncomes - sumExpenses;
        updateBalance(balanceValue);
        calculateProgressBar(sumIncomes, sumExpenses);
        checkTransactionsCount();
      }
    })
  })
});

// Balance
const updateBalance = (value) => {
  if(value < 0) {
    balance.style.color = `var(--negative-color)`;
  } else{ 
    balance.style.color = `var(--income-color)`;
  }
  balance.innerHTML = `$${value}`;
}

// Progress Bar
const calculateProgressBar = (incomeValue, expenseValue) => {
  let income = incomeValue;
  let incomePercentage = 100;
  let expense = expenseValue;
  let expensePercentage = Math.floor((expense/income)*100);
  let progressBarPercentage = 100 - Math.abs(expensePercentage - incomePercentage);
  if(income == expense) {
    progressBar.style.width = "50%";
  } else if (expense > income) {
    progressBar.style.width = `100%`;
  } else {
    progressBar.style.width = `${progressBarPercentage}%`;
  }
}

const checkTransactionsCount = () => {
  let transactionsElements = transactions.getElementsByTagName("li");
  if(transactionsElements.length >= 0) {
    noTransactions.setAttribute("style", "display: none");
  }
}

const transaction = new Transactions ();

// CHART

const jsChart = getElement("#budgetChart").getContext("2d");

// colors
const chartColors = [
  "#F48FB1",
  "#9575CD",
  "#64B5F6",
  "#DCE775",
  "#FFB74D",
];

const chart = new Chart(jsChart, {
  type: "doughnut",
  data: {
    labels: ["Clothes", "Gifts", "Shopping", "Eating out", "Sports"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0],
        backgroundColor: chartColors,
        borderColor: chartColors,
        borderWidth: 1,
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
  },
});

// Update Doughnut Chart
const updateChartValues = (array, dataOrder) => {
  chart.data.datasets[0].data[dataOrder] = array;
  chart.update();
}

// EVENT LISTENERS

window.addEventListener("DOMContentLoaded", () => {
  jsChart.canvas.parentNode.style.height = "355px";
  jsChart.canvas.parentNode.style.width = "355px";
});

addIncomeBtn.addEventListener("click", function (e) {
  transaction.openModal(e.target);
})

addExpenseBtn.addEventListener("click", function (e) {
  transaction.openModal(e.target);
})

saveBtn.addEventListener("click", function (e) {
  transaction.saveTransaction(e.target);
})

closeBtn.addEventListener("click", function (e) {
  transaction.closeModal(e.target);
})