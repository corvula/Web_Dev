const billInput = document.getElementById("bill");
const peopleInput = document.getElementById("people");
const tipButtons = document.querySelectorAll(".tip-btn");
const customTip = document.getElementById("customTip");
const tipTotal = document.getElementById("tipTotal");
const total = document.getElementById("total");
const perPerson = document.getElementById("perPerson");
const resetBtn = document.getElementById("reset");
const themeToggle = document.getElementById("themeToggle");

let bill = 0;
let tipPercent = localStorage.getItem("tipPercent") ? +localStorage.getItem("tipPercent") : 10;
let people = localStorage.getItem("people") ? +localStorage.getItem("people") : 1;

document.body.classList.toggle("dark", localStorage.getItem("theme") === "dark");

peopleInput.value = people;
selectTipButton(tipPercent);
calculate();

billInput.addEventListener("input", handleInput);
peopleInput.addEventListener("input", handleInput);
tipButtons.forEach(btn => btn.addEventListener("click", handleTip));
customTip.addEventListener("input", handleInput);
resetBtn.addEventListener("click", reset);
themeToggle.addEventListener("change", toggleTheme);

function handleInput() {
  const billVal = parseNumber(billInput.value);
  const peopleVal = parseInt(peopleInput.value);
  const customVal = parseNumber(customTip.value);

  clearErrors();

  if (billVal < 0) showError(billInput, "Сума не може бути < 0");
  if (peopleVal < 1 || isNaN(peopleVal)) showError(peopleInput, "Має бути ≥ 1");

  bill = isNaN(billVal) ? 0 : billVal;
  people = peopleVal > 0 ? peopleVal : 1;

  if (!isNaN(customVal) && customVal >= 0 && customVal <= 50) {
    tipPercent = customVal;
    localStorage.setItem("tipPercent", tipPercent);
  }

  calculate();
}

function handleTip(e) {
  tipButtons.forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");

  if (e.target.classList.contains("custom")) {
    customTip.hidden = false;
    customTip.focus();
  } else {
    customTip.hidden = true;
    tipPercent = +e.target.dataset.tip;
    localStorage.setItem("tipPercent", tipPercent);
  }
  calculate();
}

function calculate() {
  localStorage.setItem("people", people);

  if (people < 1 || bill < 0 || tipPercent < 0) return;

  const tipAmount = (bill * tipPercent) / 100;
  const totalAmount = bill + tipAmount;
  const perPersonAmount = totalAmount / people;

  tipTotal.textContent = format(tipAmount);
  total.textContent = format(totalAmount);
  perPerson.textContent = format(perPersonAmount);
}

function reset() {
  billInput.value = "";
  peopleInput.value = 1;
  tipPercent = 10;
  bill = 0;
  people = 1;
  selectTipButton(10);
  customTip.hidden = true;
  customTip.value = "";
  calculate();
}

function parseNumber(value) {
  if (!value) return NaN;
  return parseFloat(value.replace(",", "."));
}

function showError(input, msg) {
  input.nextElementSibling.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

function format(num) {
  return num.toFixed(2);
}

function selectTipButton(value) {
  tipButtons.forEach(btn => {
    if (+btn.dataset.tip === value) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}