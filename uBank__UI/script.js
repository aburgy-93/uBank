"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Selectors
const welcomeMessage = document.querySelector(".welcome--message");
const accountContent = document.querySelector(".account__content");
const leftNav = document.querySelector(".uBank--left--nav");

const containerMovements = document.querySelector(".movements");
const summaryIn = document.querySelector(".summary__value--in");
const summaryOut = document.querySelector(".summary__value--out");
const summaryInterest = document.querySelector(".summary__value--interest");
const currentBalance = document.querySelector(".balance__value");

const btnLogin = document.querySelector(".login__btn");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputLoginUsername = document.querySelector(".login__input--user");

const btnTransfer = document.querySelector(".form__btn--transfer");
const inputTransferUsername = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

// Project Logic

// display movements
const displayMovements = function (movements) {
  containerMovements.innerHTML = "";

  movements.forEach(function (movs, i) {
    const type = movs > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__left">
          <div class="movements__type movement__type--${type}">
            ${i + 1} ${type}
        </div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">$${Math.abs(movs)}</div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display Current Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  currentBalance.innerHTML = `$${acc.balance}`;
};

// Account Summary

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce((acc, mov) => acc + mov, 0);
  summaryIn.innerHTML = `$${incomes}`;

  const expenses = acc.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce((acc, mov) => acc + mov, 0);
  summaryOut.innerHTML = `$${Math.abs(expenses)}`;

  const interest = acc.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map((mov) => mov * (acc.interestRate / 100))
    .reduce((acc, mov) => acc + mov, 0);
  summaryInterest.innerHTML = `$${interest}`;
};

// Create username
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);

// Implement Login

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // const username = inputLoginUsername.value;
  // const pin = inputLoginPin.value;

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //     .uBank--left--nav,
    // .account__content
    // Display UI
    accountContent.style.opacity = 100;
    leftNav.style.opacity = 100;

    // Welcome Message
    welcomeMessage.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
  }

  // Clear fields
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();

  // Update UI
  updateUI(currentAccount);
});

// Implementing Transfers

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferUsername.value
  );

  console.log(inputTransferAmount.value, inputTransferUsername.value);

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc?.username != currentAccount.username &&
    recieverAcc
  ) {
    // Doing Transfer
    recieverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Update UI
    updateUI(currentAccount);
  }

  // Clear fields
  inputTransferUsername.value = inputTransferAmount.value = "";
  inputLoginPin.blur();
});
