const savedTheme = localStorage.getItem("pomodoro-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const resetButton = document.querySelector("#reset");
const display = document.querySelector("#display");
const workOrBreakButton = document.querySelector("#workOrBreak");
const modeDisplay = document.querySelector("#mode-label");
const plusButton = document.querySelector("#workPlus");
const minusButton = document.querySelector("#workMinus");

const openingBell = new Audio("sounds/opening-bell.mp3");
const closingBell = new Audio("sounds/clear-bell.mp3");

const title = document.querySelector("title");

let workDuration = 25 * 60;
let breakDuration = 5 * 60;
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
  title.textContent = `${display.textContent} - ${currentMode === "work" ? "Work" : "Break"} Timer`;
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

function addTime() {
  remainingTime += 60;
  updateDisplay();
}
function minusTime() {
  if (remainingTime > 60) {
    remainingTime -= 60;
    updateDisplay();
  } else {
    remainingTime = 0;
    updateDisplay();
  }
}

function pauseTimer() {
  if (timerRunning) {
    timerRunning = false;
    clearInterval(intervalId);
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
  pauseTimer();
});

resetButton.addEventListener("click", () => {
  resetTimer();
});

workOrBreakButton.addEventListener("click", () => {
  toggleMode();
});

plusButton.addEventListener("click", () => {
  addTime();
});

minusButton.addEventListener("click", () => {
  minusTime();
});

document.addEventListener("keydown", (event) => {
  if (event.target.tagName === "INPUT") return;
  if (event.code === "Space") {
    if (timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  } else if (event.code === "KeyR") {
    resetTimer();
  } else if (event.code === "KeyM") {
    toggleMode();
  } else if (event.code === "ArrowUp") {
    addTime();
  } else if (event.code === "ArrowDown") {
    minusTime();
  }
});

const themeToggleButton = document.querySelector(".themeToggle");

themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("pomodoro-theme", "dark");
  } else {
    localStorage.setItem("pomodoro-theme", "light");
  }
});
