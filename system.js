const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#descr");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btn-new");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

function insertItems(index, item) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
  <td>${item.desc}</td>
  <td>US$ ${item.amount}</td>
  <td class="columnType">${
    item.type === "Prohibited"
      ? '<i class="bx bxs-chevron-up-circle"></i>'
      : '<i class="bx bxs-chevron-down-circle"></i>'
  }</td>
  <td class="columnAction">
    <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
  </td>
`;

  tbody.appendChild(tr);
}

function loadItems() {
  items = getItemsBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItems(index, item);
  });
  getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Prohibited")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Output")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);
  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);
  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;

  console.log(getTotals);
}

function deleteItem(index) {
  items.splice(index, 1);
  setItensDB();
  loadItems();
}

const getItemsBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensDB = () =>
  localStorage.setItem("db_items", JSON.stringify(items));

loadItems();

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Fill the form!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(amount.value).toFixed(2),
    type: type.value,
  });

  setItensDB();
  loadItems();

  descItem.value = "";
  amount.value = "";
};
