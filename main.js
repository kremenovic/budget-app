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

let id = null;

const addIncomeBtn = getElement(".js-btnAddIncome");
const addExpenseBtn = getElement(".js-btnAddExpense");
const transactions = getElement(".js-transactions");
const saveBtn = getElement(".js-save");
const closeBtn = getElement(".js-cancel");

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
    let transactionID = id++;
    this.title = modal.querySelector(".js-title");
    this.amount = modal.querySelector(".js-amount");
    this.category = modal.querySelector(".js-category");

    if (this.category.value !== "select") {
      if (this.title.value !== "" || this.amount.value !== "") {
        this.createElement(transactionID, this.category.length, this.title.value, this.category.value, this.amount.value);
        this.closeModal(target);
        this.backToDefault(this.title, this.amount);
      } else {
        alert("You cannot add empty value...");
      }
    } else {
      alert("Please select category...");
    }
    
  }

  createElement(id, categoryNumber, title, category, amount) {
    let item = document.createElement("li");
    if(categoryNumber > 1) {
      item.classList.add("expense");

    } else {
      item.classList.add("income");
    }

    item.setAttribute("data-id", id);
    item.innerHTML = `${category} | ${title}<span class="amount">$${amount}</span>`;
    transactions.appendChild(item);
  }

  backToDefault (title, amount) {
    title.value = "";
    amount.value = "";
  }
}

const transaction = new Transactions ();
const jsChart = getElement("#budgetChart").getContext("2d");

// CHART

// colors
const chartColors = [
  "#03DAC5",
  "#F48FB1",
  "#9575CD",
  "#64B5F6",
  "#DCE775",
  "#FFB74D",
];

const chart = new Chart(jsChart, {
  type: "doughnut",
  data: {
    labels: ["Income", "Clothes", "Gifts", "Shopping", "Eating out", "Sports"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
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