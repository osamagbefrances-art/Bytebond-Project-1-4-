// Global State
let is24HourFormat = false;

// DOM Elements - Clock
const clockDisplay = document.getElementById('clock-display');
const dateDisplay = document.getElementById('date-display');
const formatToggleBtn = document.getElementById('format-toggle-btn');

// DOM Elements - Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const toolPanels = document.querySelectorAll('.tool-panel');

// DOM Elements - Stopwatch
const stopwatchDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('sw-start-btn');
const swPauseBtn = document.getElementById('sw-pause-btn');
const swResetBtn = document.getElementById('sw-reset-btn');

// DOM Elements - Countdown Timer
const timerDisplay = document.getElementById('timer-display');
const timerHoursInput = document.getElementById('timer-hours');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const tmStartBtn = document.getElementById('tm-start-btn');
const tmPauseBtn = document.getElementById('tm-pause-btn');
const tmResetBtn = document.getElementById('tm-reset-btn');

// Helper: Format single digits with leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// -------------------------------------------------------------
// 1. LIVE DIGITAL CLOCK & DYNAMIC BACKGROUND
// -------------------------------------------------------------
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  // Update Dynamic Theme
  updateTheme(hours);

  // Format Time Output
  let timeString = '';
  if (is24HourFormat) {
    timeString = `${padZero(hours)}:${minutes}:${seconds}`;
  } else {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    timeString = `${padZero(hours)}:${minutes}:${seconds} ${ampm}`;
  }

  clockDisplay.textContent = timeString;

  // Format Date Output
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

function updateTheme(hours) {
  document.body.classList.remove('morning', 'afternoon', 'evening', 'night');

  if (hours >= 5 && hours < 12) {
    document.body.classList.add('morning');
  } else if (hours >= 12 && hours < 17) {
    document.body.classList.add('afternoon');
  } else if (hours >= 17 && hours < 21) {
    document.body.classList.add('evening');
  } else {
    document.body.classList.add('night');
  }
}

formatToggleBtn.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat;
  formatToggleBtn.textContent = is24HourFormat 
    ? 'Switch to 12-Hour Format' 
    : 'Switch to 24-Hour Format';
  updateClock();
});

setInterval(updateClock, 1000);
updateClock();

// -------------------------------------------------------------
// 2. TAB NAVIGATION
// -------------------------------------------------------------
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    toolPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// -------------------------------------------------------------
// 3. STOPWATCH FEATURE
// -------------------------------------------------------------
let stopwatchInterval = null;
let stopwatchElapsedTime = 0; // In seconds

function formatStopwatchTime(totalSeconds) {
  const hrs = padZero(Math.floor(totalSeconds / 3600));
  const mins = padZero(Math.floor((totalSeconds % 3600) / 60));
  const secs = padZero(totalSeconds % 60);
  return `${hrs}:${mins}:${secs}`;
}

swStartBtn.addEventListener('click', () => {
  swStartBtn.disabled = true;
  swPauseBtn.disabled = false;
  swResetBtn.disabled = false;

  stopwatchInterval = setInterval(() => {
    stopwatchElapsedTime++;
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsedTime);
  }, 1000);
});

swPauseBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  swStartBtn.disabled = false;
  swPauseBtn.disabled = true;
});

swResetBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchElapsedTime = 0;
  stopwatchDisplay.textContent = '00:00:00';
  swStartBtn.disabled = false;
  swPauseBtn.disabled = true;
  swResetBtn.disabled = true;
});

// -------------------------------------------------------------
// 4. COUNTDOWN TIMER FEATURE
// -------------------------------------------------------------
let timerInterval = null;
let timerRemainingSeconds = 0;

function formatTimerTime(totalSeconds) {
  const hrs = padZero(Math.floor(totalSeconds / 3600));
  const mins = padZero(Math.floor((totalSeconds % 3600) / 60));
  const secs = padZero(totalSeconds % 60);
  return `${hrs}:${mins}:${secs}`;
}

tmStartBtn.addEventListener('click', () => {
  // If starting fresh (not resuming from pause)
  if (timerRemainingSeconds === 0) {
    const h = parseInt(timerHoursInput.value) || 0;
    const m = parseInt(timerMinutesInput.value) || 0;
    const s = parseInt(timerSecondsInput.value) || 0;

    timerRemainingSeconds = h * 3600 + m * 60 + s;
  }

  if (timerRemainingSeconds <= 0) return;

  tmStartBtn.disabled = true;
  tmPauseBtn.disabled = false;
  tmResetBtn.disabled = false;

  timerDisplay.textContent = formatTimerTime(timerRemainingSeconds);

  timerInterval = setInterval(() => {
    timerRemainingSeconds--;
    timerDisplay.textContent = formatTimerTime(timerRemainingSeconds);

    if (timerRemainingSeconds <= 0) {
      clearInterval(timerInterval);
      alert('Time is up!');
      resetTimer();
    }
  }, 1000);
});

tmPauseBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  tmStartBtn.disabled = false;
  tmPauseBtn.disabled = true;
});

function resetTimer() {
  clearInterval(timerInterval);
  timerRemainingSeconds = 0;
  timerDisplay.textContent = '00:00:00';
  timerHoursInput.value = '';
  timerMinutesInput.value = '';
  timerSecondsInput.value = '';
  tmStartBtn.disabled = false;
  tmPauseBtn.disabled = true;
  tmResetBtn.disabled = true;
}

tmResetBtn.addEventListener('click', resetTimer);