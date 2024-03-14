const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let timerInterval;
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");

scoreDisplay.textContent = score;
let seconds = 0;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
    startTimer();
  });

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    score++;
    scoreDisplay.textContent = score;
    lockBoard = true;
    checkForMatch();
  }
}

function checkForMatch() {
  if (firstCard.dataset.name === secondCard.dataset.name) {
    score++; // Increment score if there is a match
    scoreDisplay.textContent = score;
    disableCards();
  } else {
    setTimeout(unflipCards, 1000);
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  firstCard.classList.remove("flipped");
  secondCard.classList.remove("flipped");
  resetBoard();
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent =
      `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function restart() {
  gridContainer.innerHTML = "";
  score = 0;
  scoreDisplay.textContent = score;
  resetBoard();
  shuffleCards();
  generateCards();
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = '00:00';
  startTimer();
}
