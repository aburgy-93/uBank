"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-10-16T17:01:17.194Z",
    "2022-10-22T23:36:17.929Z",
    "2022-10-23T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
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

const btnLoan = document.querySelector(".form__btn--loan");
const inputLoanAmount = document.querySelector(".form__input--loan");

const btnClose = document.querySelector(".form__btn--close");
const inputCloseAccount = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const btnSort = document.querySelector(".btn--sort");

const labelDate = document.querySelector(".date");

// Project Logic

// Dates

// display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (movs, i) {
    const type = movs > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);

    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displayDate = `${month}/${day}/${year}`;

    const html = `
      <div class="movements__row">
        <div class="movements__left">
          <div class="movements__type movement__type--${type}">
            ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
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
  displayMovements(acc);
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
    // Display UI
    accountContent.style.opacity = 100;
    leftNav.style.opacity = 100;

    // Create Current date and time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${month}/${day}/${year}, ${hour}:${min}`;

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

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc?.username != currentAccount.username &&
    recieverAcc
  ) {
    // Doing Transfer
    recieverAcc.movements.push(amount);
    currentAccount.movements.push(-amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date()).toISOString();
    recieverAcc.movementsDates.push(new Date()).toISOString();

    // Update UI
    updateUI(currentAccount);
  }

  // Clear fields
  inputTransferUsername.value = inputTransferAmount.value = "";
  inputLoginPin.blur();
});

// Implement Loans

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmnt = Number(inputLoanAmount.value);

  // check if any deposits are >= 10% loan amount
  if (
    loanAmnt > 0 &&
    currentAccount.movements.some((mov) => mov >= 0.1 * loanAmnt)
  ) {
    // adding the loan to account
    currentAccount.movements.push(loanAmnt);

    // Add loan date
    currentAccount.movementsDates.push(new Date()).toISOString();

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseAccount.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    // Update UI
    accountContent.style.opacity = 0;
    leftNav.style.opacity = 0;
  }

  inputCloseAccount.value = inputClosePin.value = "";
});

// // Sorting Arrays

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
// console.log(account1.movements);
// console.log(
//   account1.movements.sort(function (a, b) {
//     return a - b;
//   })
// );
