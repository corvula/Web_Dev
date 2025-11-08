const facts = [
  "Люблю каву більше, ніж чай",
  "Мрію побачити Японію 🌸",
  "Обожнюю котів 🐱",
  "Навчаюсь програмуванню кожного дня",
  "У вільний час слухаю музику або гуляю з друзями",
];

const factBtn = document.getElementById("fact-btn");
const factElement = document.getElementById("fact");
const themeBtn = document.getElementById("theme-btn");
const visitsCount = document.getElementById("visits-count");
const easterEggBtn = document.getElementById("easter-egg-btn");

factBtn.addEventListener("click", () => {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  factElement.textContent = randomFact;
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

let visits = localStorage.getItem("visits");
visits = visits ? Number(visits) + 1 : 1;
localStorage.setItem("visits", visits);
visitsCount.textContent = visits;

easterEggBtn.addEventListener("click", () => {
  window.location.href = "https://poki.com/ua/g/cats-drop";
});