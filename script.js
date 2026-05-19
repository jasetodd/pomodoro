const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");
const display = document.querySelector("#display");
const workOrBreakButton = document.querySelector("#workOrBreak");
const modeDisplay = document.querySelector("#mode-label");

const openingBell = new Audio("sounds/opening-bell.mp3");
const closingBell = new Audio("sounds/clear-bell.mp3");

// let workDuration = 25 * 60;
let workDuration = 2;
// let breakDuration = 5 * 60;
let breakDuration = 5;
let currentMode = "work";
let timerRunning = false;
let intervalId = null;
let remainingTime = workDuration;

//functions: update display, reset timer, start timer

function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  modeDisplay.textContent = currentMode === "work" ? "Work" : "Break";
}

function resetTimer() {
  clearInterval(intervalId);
  timerRunning = false;
  remainingTime = currentMode === "work" ? workDuration : breakDuration;
  updateDisplay();
}
function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    intervalId = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        updateDisplay();
        if (currentMode === "work" && remainingTime === 0) {
          closingBell.play();
        } else if (currentMode === "break" && remainingTime === 0) {
          openingBell.play();
        }
      } else {
        clearInterval(intervalId);
        timerRunning = false;
        if (currentMode === "work") {
          closingBell.play();
        } else {
          openingBell.play();
        }
        if (currentMode === "work") {
          currentMode = "break";
          remainingTime = breakDuration;
        } else {
          currentMode = "work";
          remainingTime = workDuration;
        }
        updateDisplay();
        startTimer();
      }
    }, 1000);
  }
}

startButton.addEventListener("click", () => {
  if (currentMode === "") {
    currentMode = "work";
    remainingTime = workDuration;
    updateDisplay();
  }
  startTimer();
});

pauseButton.addEventListener("click", () => {
  if (timerRunning) {
    timerRunning = false;
    clearInterval(intervalId);
  }
});

resetButton.addEventListener("click", () => {
  resetTimer();
});

workOrBreakButton.addEventListener("click", () => {
  toggleMode();
});

function toggleMode() {
  if (currentMode === "work") {
    currentMode = "break";
    remainingTime = breakDuration;
    updateDisplay();
  } else {
    currentMode = "work";
    remainingTime = workDuration;
    updateDisplay();
  }
}
