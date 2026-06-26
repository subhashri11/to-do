/* ==========================================================
   SMART STUDENT PRODUCTIVITY DASHBOARD — script.js
   Vanilla JavaScript · Modular · LocalStorage · UI controls
   ========================================================== */

const storageKeys = {
  theme: 'ssp-theme',
  accent: 'ssp-accent',
  tasks: 'ssp-tasks',
  notes: 'ssp-notes',
  goal: 'ssp-goal',
  habits: 'ssp-habits',
  pomodoro: 'ssp-pomodoro',
  weatherCity: 'ssp-weather-city',
  quoteIndex: 'ssp-quote-index',
};

const weatherApi = {
  key: '',
  base: 'https://api.openweathermap.org/data/2.5/weather',
};

const quoteList = [
  { text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' },
  { text: 'The future depends on what you do today.', author: 'Mahatma Gandhi' },
  { text: 'Small steps every day lead to big results.', author: 'Unknown' },
  { text: 'A goal without a plan is just a wish.', author: 'Antoine de Saint-Exupéry' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'Dreams don’t work unless you do.', author: 'John C. Maxwell' },
  { text: 'Good things happen to those who hustle.', author: 'Anais Nin' },
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'You don’t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
  { text: 'Your limitation—it’s only your imagination.', author: 'Unknown' },
  { text: 'If you’re going through hell, keep going.', author: 'Winston Churchill' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'The best way to predict the future is to create it.', author: 'Peter Drucker' },
  { text: 'Focus is a matter of deciding what things you’re not going to do.', author: 'John Carmack' },
  { text: 'The key is not to prioritize what’s on your schedule, but to schedule your priorities.', author: 'Stephen Covey' },
  { text: 'Time is a created thing. To say “I don’t have time” is to admit you do not want to.', author: 'Lao Tzu' },
  { text: 'Use time wisely. You never get it back.', author: 'Unknown' },
  { text: 'Productivity is being able to do things that you were never able to do before.', author: 'Franz Kafka' },
  { text: 'Success is not the key to happiness. Happiness is the key to success.', author: 'Albert Schweitzer' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Don’t count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'What we fear of doing most is usually what we most need to do.', author: 'Ralph Waldo Emerson' },
  { text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'You miss 100% of the shots you don’t take.', author: 'Wayne Gretzky' },
  { text: 'A little progress each day adds up to big results.', author: 'Satya Nani' },
  { text: 'Productivity is never an accident. It is always the result of a commitment to excellence.', author: 'Paul J. Meyer' },
  { text: 'Success usually comes to those who are too busy to be looking for it.', author: 'Henry David Thoreau' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'Do what you can, with what you have, where you are.', author: 'Theodore Roosevelt' },
  { text: 'The only limit to our realization of tomorrow is our doubts of today.', author: 'Franklin D. Roosevelt' },
  { text: 'Efforts and courage are not enough without purpose and direction.', author: 'John F. Kennedy' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { text: 'Start by doing what’s necessary; then do what’s possible; and suddenly you are doing the impossible.', author: 'Francis of Assisi' },
  { text: 'Every strike brings me closer to the next home run.', author: 'Babe Ruth' },
  { text: 'If you want to achieve greatness stop asking for permission.', author: 'Unknown' },
  { text: 'Stop wishing, start doing.', author: 'Unknown' },
  { text: 'You may have to fight a battle more than once to win it.', author: 'Margaret Thatcher' },
  { text: 'Success is walking from failure to failure with no loss of enthusiasm.', author: 'Winston Churchill' },
  { text: 'Hard work beats talent when talent doesn’t work hard.', author: 'Tim Notke' },
  { text: 'Motivation gets you going and habit keeps you growing.', author: 'John Maxwell' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
  { text: 'Focus is the new IQ.', author: 'Unknown' },
  { text: 'The more I want to get something done, the less I call it work.', author: 'Richard Bach' },
];

const defaultHabits = [
  { id: 'habit-water', name: 'Drink Water', emoji: '💧', checked: false, streak: 0, lastChecked: '' },
  { id: 'habit-exercise', name: 'Exercise', emoji: '🏃', checked: false, streak: 0, lastChecked: '' },
  { id: 'habit-read', name: 'Read', emoji: '📖', checked: false, streak: 0, lastChecked: '' },
  { id: 'habit-code', name: 'Code', emoji: '💻', checked: false, streak: 0, lastChecked: '' },
  { id: 'habit-meditate', name: 'Meditate', emoji: '🧘', checked: false, streak: 0, lastChecked: '' },
];

const state = {
  theme: 'dark',
  accent: 'sage',
  tasks: [],
  notes: [],
  activeNoteId: null,
  goal: { text: '', done: false },
  habits: [...defaultHabits],
  pomodoro: { duration: 25, remaining: 1500, isRunning: false, intervalId: null, sessions: 0 },
  weatherCity: 'Seattle',
  quoteIndex: 0,
  calendarDate: new Date(),
  confetti: { active: false, particles: [], rafId: null },
};

const dom = {
  themeToggle: document.getElementById('themeToggle'),
  themeToggleMobile: document.getElementById('themeToggleMobile'),
  swatches: document.querySelectorAll('.swatch'),
  sidebar: document.getElementById('sidebar'),
  hamburger: document.getElementById('hamburger'),
  navButtons: document.querySelectorAll('.nav-item'),
  sections: document.querySelectorAll('.section'),
  greetingText: document.getElementById('greetingText'),
  dateText: document.getElementById('dateText'),
  clockDisplay: document.getElementById('clockDisplay'),
  clockDate: document.getElementById('clockDate'),
  clockPeriod: document.getElementById('clockPeriod'),
  goalInput: document.getElementById('goalInput'),
  saveGoalBtn: document.getElementById('saveGoalBtn'),
  goalDisplayArea: document.getElementById('goalDisplayArea'),
  goalDisplay: document.getElementById('goalDisplay'),
  goalText: document.getElementById('goalText'),
  goalDone: document.getElementById('goalDone'),
  editGoalBtn: document.getElementById('editGoalBtn'),
  completedCount: document.getElementById('completedCount'),
  totalCount: document.getElementById('totalCount'),
  progressBarFill: document.getElementById('progressBarFill'),
  progressPercent: document.getElementById('progressPercent'),
  calPrev: document.getElementById('calPrev'),
  calNext: document.getElementById('calNext'),
  calMonthYear: document.getElementById('calMonthYear'),
  calendarGrid: document.getElementById('calendarGrid'),
  quoteText: document.getElementById('quoteText'),
  quoteAuthor: document.getElementById('quoteAuthor'),
  nextQuoteBtn: document.getElementById('nextQuoteBtn'),
  weatherIcon: document.getElementById('weatherIcon'),
  weatherTemp: document.getElementById('weatherTemp'),
  weatherDesc: document.getElementById('weatherDesc'),
  weatherCity: document.getElementById('weatherCity'),
  weatherHumidity: document.getElementById('weatherHumidity'),
  weatherCityInput: document.getElementById('weatherCityInput'),
  fetchWeatherBtn: document.getElementById('fetchWeatherBtn'),
  taskInput: document.getElementById('taskInput'),
  addTaskBtn: document.getElementById('addTaskBtn'),
  taskSearch: document.getElementById('taskSearch'),
  taskSort: document.getElementById('taskSort'),
  taskCountLabel: document.getElementById('taskCountLabel'),
  taskList: document.getElementById('taskList'),
  newNoteBtn: document.getElementById('newNoteBtn'),
  notesList: document.getElementById('notesList'),
  notesEditorEmpty: document.getElementById('notesEditorEmpty'),
  notesEditorActive: document.getElementById('notesEditorActive'),
  noteTitleInput: document.getElementById('noteTitleInput'),
  noteBodyInput: document.getElementById('noteBodyInput'),
  autosaveLabel: document.getElementById('autosaveLabel'),
  deleteNoteBtn: document.getElementById('deleteNoteBtn'),
  pomodoroTime: document.getElementById('pomodoroTime'),
  pomodoroSession: document.getElementById('pomodoroSession'),
  pomodoroStart: document.getElementById('pomodoroStart'),
  pomodoroPause: document.getElementById('pomodoroPause'),
  pomodoroReset: document.getElementById('pomodoroReset'),
  ringFill: document.getElementById('ringFill'),
  durationBtns: document.querySelectorAll('.duration-btn'),
  pomodoroSessionCount: document.getElementById('pomodoroSessionCount'),
  habitsGrid: document.getElementById('habitsGrid'),
  toastContainer: document.getElementById('toast-container'),
  confettiCanvas: document.getElementById('confetti-canvas'),
};

const calendarLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const habitDateKey = () => new Date().toISOString().slice(0, 10);

function getLocalData(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch (err) { return fallback; }
}

function setLocalData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(storageKeys.theme, theme);
  const icon = theme === 'dark' ? '☾' : '☀';
  dom.themeToggle.textContent = icon;
  dom.themeToggleMobile.textContent = icon;
  showToast(`${theme === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'success');
}

function setAccent(accent) {
  state.accent = accent;
  document.documentElement.dataset.accent = accent;
  dom.swatches.forEach((button) => {
    button.classList.toggle('active', button.dataset.color === accent);
  });
  localStorage.setItem(storageKeys.accent, accent);
}

function updateGreeting() {
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  dom.greetingText.textContent = `Good ${part}, Student 👋`;
}

function formatClock(date) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const time = date.toLocaleTimeString([], { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
  const period = date.toLocaleTimeString([], { hour12: true, hour: 'numeric' }).split(' ')[1] || '';
  dom.clockDisplay.textContent = time;
  dom.clockDate.textContent = date.toLocaleDateString([], options);
  dom.clockPeriod.textContent = period.toUpperCase();
  dom.dateText.textContent = date.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function startClock() {
  formatClock(new Date());
  updateGreeting();
  setInterval(() => {
    formatClock(new Date());
    updateGreeting();
  }, 1000);
}

function renderCalendar() {
  const year = state.calendarDate.getFullYear();
  const month = state.calendarDate.getMonth();
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const monthLength = new Date(year, month + 1, 0).getDate();
  const previousMonthLength = new Date(year, month, 0).getDate();

  dom.calMonthYear.textContent = `${monthNames[month]} ${year}`;
  dom.calendarGrid.innerHTML = '';

  calendarLabels.forEach((label) => {
    const header = document.createElement('div');
    header.className = 'cal-day-header';
    header.textContent = label;
    dom.calendarGrid.appendChild(header);
  });

  for (let i = 0; i < firstDay; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.textContent = previousMonthLength - firstDay + 1 + i;
    dom.calendarGrid.appendChild(cell);
  }

  for (let day = 1; day <= monthLength; day += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cal-day';
    cell.textContent = day;
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) cell.classList.add('today');
    dom.calendarGrid.appendChild(cell);
  }

  const trailingDays = (7 - ((firstDay + monthLength) % 7)) % 7;
  for (let i = 1; i <= trailingDays; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cal-day other-month';
    cell.textContent = i;
    dom.calendarGrid.appendChild(cell);
  }
}

function renderQuote(index = null) {
  if (index === null) {
    index = getLocalData(storageKeys.quoteIndex, Math.floor(Math.random() * quoteList.length));
  }
  state.quoteIndex = Math.min(Math.max(index, 0), quoteList.length - 1);
  const quote = quoteList[state.quoteIndex];
  dom.quoteText.textContent = quote.text;
  dom.quoteAuthor.textContent = `— ${quote.author}`;
  setLocalData(storageKeys.quoteIndex, state.quoteIndex);
}

function nextQuote() {
  const nextIndex = (state.quoteIndex + 1) % quoteList.length;
  renderQuote(nextIndex);
}

function renderWeather(data) {
  dom.weatherCity.textContent = data.city;
  dom.weatherTemp.textContent = `${data.temp}°C`;
  dom.weatherDesc.textContent = data.desc;
  dom.weatherHumidity.textContent = `Humidity: ${data.humidity}%`;
  dom.weatherIcon.textContent = data.icon;
}

function getWeatherIcon(condition) {
  const normalized = condition.toLowerCase();
  if (normalized.includes('cloud')) return '☁️';
  if (normalized.includes('rain') || normalized.includes('drizzle')) return '🌧️';
  if (normalized.includes('thunder')) return '⚡';
  if (normalized.includes('snow')) return '❄️';
  if (normalized.includes('clear')) return '☀️';
  if (normalized.includes('mist') || normalized.includes('haze')) return '🌫️';
  return '🌤️';
}

function showDummyWeather(city) {
  renderWeather({ city, temp: 22, humidity: 60, desc: 'Partly cloudy', icon: '⛅' });
}

async function fetchWeather(city) {
  if (!city) return;
  const fallback = () => showDummyWeather(city);
  if (!weatherApi.key) {
    fallback();
    return;
  }
  try {
    const response = await fetch(`${weatherApi.base}?q=${encodeURIComponent(city)}&appid=${weatherApi.key}&units=metric`);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    const weatherData = {
      city: `${data.name}, ${data.sys.country}`,
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      desc: data.weather[0].main,
      icon: getWeatherIcon(data.weather[0].main),
    };
    renderWeather(weatherData);
    setLocalData(storageKeys.weatherCity, city);
  } catch (error) {
    fallback();
  }
}

function buildTaskHtml(task) {
  const isCompleted = task.done ? 'completed' : '';
  const insertText = task.editing
    ? `<input aria-label="Edit task" class="task-edit-input" type="text" value="${escapeHtml(task.text)}" data-edit-id="${task.id}" />`
    : `<span class="task-text">${escapeHtml(task.text)}</span>`;
  return `
    <li class="task-item ${isCompleted}" data-task-id="${task.id}">
      <button class="task-btn task-toggle" aria-label="Mark task ${task.done ? 'undone' : 'done'}">${task.done ? '☑' : '☐'}</button>
      ${insertText}
      <div class="task-actions">
        <button class="task-btn edit" type="button" aria-label="Edit task">✎</button>
        <button class="task-btn task-delete delete" type="button" aria-label="Delete task">🗑</button>
      </div>
    </li>
  `;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTasks() {
  const filter = dom.taskSearch.value.trim().toLowerCase();
  const sortMethod = dom.taskSort.value;
  let visibleTasks = [...state.tasks];

  if (filter) {
    visibleTasks = visibleTasks.filter((task) => task.text.toLowerCase().includes(filter));
  }

  if (sortMethod === 'alpha') {
    visibleTasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortMethod === 'done') {
    visibleTasks.sort((a, b) => (b.done - a.done));
  } else if (sortMethod === 'undone') {
    visibleTasks.sort((a, b) => (a.done - b.done));
  } else {
    visibleTasks.sort((a, b) => a.createdAt - b.createdAt);
  }

  dom.taskList.innerHTML = visibleTasks.map(buildTaskHtml).join('') || '<li class="task-item"><span class="task-text">No tasks yet.</span></li>';
  updateProgress();
}

function updateProgress() {
  const total = state.tasks.length;
  const completed = state.tasks.filter((task) => task.done).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  dom.taskCountLabel.textContent = `${total} task${total === 1 ? '' : 's'} · ${completed} completed`;
  dom.completedCount.textContent = completed;
  dom.totalCount.textContent = total;
  dom.progressPercent.textContent = `${percent}%`;
  dom.progressBarFill.style.width = `${percent}%`;

  if (total && completed === total) {
    launchConfetti();
    showToast('All tasks completed! Great work!', 'success');
  }
}

function saveTasks() {
  setLocalData(storageKeys.tasks, state.tasks);
}

function addTask(text) {
  if (!text.trim()) {
    showToast('Enter a task before adding.', 'warning');
    return;
  }
  state.tasks.unshift({
    id: crypto.randomUUID(),
    text: text.trim(),
    done: false,
    editing: false,
    createdAt: Date.now(),
  });
  dom.taskInput.value = '';
  saveTasks();
  renderTasks();
  showToast('Task added', 'success');
}

function toggleTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.done = !task.done;
  task.editing = false;
  saveTasks();
  renderTasks();
  showToast(task.done ? 'Task completed' : 'Task marked undone', 'success');
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((item) => item.id !== id);
  saveTasks();
  renderTasks();
  showToast('Task deleted', 'danger');
}

function enableTaskEdit(id) {
  state.tasks = state.tasks.map((item) => ({ ...item, editing: item.id === id }));
  renderTasks();
  requestAnimationFrame(() => {
    const input = dom.taskList.querySelector(`[data-edit-id="${id}"]`);
    if (input) input.focus();
  });
}

function saveTaskEdit(id, value) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return;
  task.text = value.trim() || task.text;
  task.editing = false;
  saveTasks();
  renderTasks();
  showToast('Task updated', 'success');
}

function loadGoal() {
  const saved = getLocalData(storageKeys.goal, null);
  if (saved && saved.text) {
    state.goal = saved;
    dom.goalInput.value = saved.text;
    dom.goalDisplay.style.display = 'block';
    dom.goalDisplayArea.style.display = 'none';
    dom.goalText.textContent = saved.text;
    dom.goalDone.checked = saved.done;
  } else {
    dom.goalDisplay.style.display = 'none';
    dom.goalDisplayArea.style.display = 'block';
  }
}

function saveGoal() {
  const text = dom.goalInput.value.trim();
  if (!text) {
    showToast('Please enter a study goal first.', 'warning');
    return;
  }
  state.goal = { text, done: false };
  setLocalData(storageKeys.goal, state.goal);
  loadGoal();
  showToast('Daily goal saved', 'success');
}

function toggleGoalDone() {
  state.goal.done = dom.goalDone.checked;
  setLocalData(storageKeys.goal, state.goal);
  showToast(state.goal.done ? 'Goal completed!' : 'Goal marked undone', 'success');
}

function editGoal() {
  dom.goalDisplay.style.display = 'none';
  dom.goalDisplayArea.style.display = 'block';
  dom.goalInput.focus();
}

function renderNotes() {
  dom.notesList.innerHTML = state.notes.map((note) => {
    const active = note.id === state.activeNoteId ? 'active' : '';
    const title = note.title || 'Untitled note';
    const preview = note.body ? note.body.slice(0, 38) : 'No content yet.';
    return `
      <li class="note-list-item ${active}" data-note-id="${note.id}" tabindex="0">
        <div class="note-list-title">${escapeHtml(title)}</div>
        <div class="note-list-preview">${escapeHtml(preview)}</div>
      </li>
    `;
  }).join('');

  const selected = state.notes.find((note) => note.id === state.activeNoteId);
  if (selected) {
    dom.notesEditorEmpty.style.display = 'none';
    dom.notesEditorActive.style.display = 'flex';
    dom.noteTitleInput.value = selected.title;
    dom.noteBodyInput.value = selected.body;
  } else {
    dom.notesEditorEmpty.style.display = 'flex';
    dom.notesEditorActive.style.display = 'none';
  }
}

function selectNote(id) {
  state.activeNoteId = id;
  renderNotes();
}

function createNote() {
  const newNote = {
    id: crypto.randomUUID(),
    title: 'New note',
    body: '',
    updatedAt: Date.now(),
  };
  state.notes.unshift(newNote);
  state.activeNoteId = newNote.id;
  saveNotes();
  renderNotes();
  showToast('Note created', 'success');
}

function saveNotes() {
  setLocalData(storageKeys.notes, state.notes);
}

function deleteNote() {
  if (!state.activeNoteId) return;
  state.notes = state.notes.filter((note) => note.id !== state.activeNoteId);
  state.activeNoteId = state.notes.length ? state.notes[0].id : null;
  saveNotes();
  renderNotes();
  showToast('Note deleted', 'danger');
}

let noteSaveTimeout = null;
function commitNoteChanges() {
  const note = state.notes.find((item) => item.id === state.activeNoteId);
  if (!note) return;
  note.title = dom.noteTitleInput.value.trim() || 'Untitled note';
  note.body = dom.noteBodyInput.value;
  note.updatedAt = Date.now();
  saveNotes();
  renderNotes();
  dom.autosaveLabel.textContent = 'Auto-saved';
}

function scheduleNoteSave() {
  dom.autosaveLabel.textContent = 'Saving...';
  clearTimeout(noteSaveTimeout);
  noteSaveTimeout = setTimeout(commitNoteChanges, 500);
}

function renderPomodoro() {
  const minutes = Math.floor(state.pomodoro.remaining / 60);
  const seconds = state.pomodoro.remaining % 60;
  dom.pomodoroTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  dom.pomodoroSession.textContent = state.pomodoro.isRunning ? 'Focus' : 'Ready';
  dom.pomodoroSessionCount.textContent = state.pomodoro.sessions;

  const circumference = 2 * Math.PI * 88;
  const progress = state.pomodoro.remaining / (state.pomodoro.duration * 60);
  const offset = circumference * (1 - progress);
  dom.ringFill.style.strokeDashoffset = offset;

  dom.pomodoroPause.disabled = !state.pomodoro.isRunning;
}

function savePomodoro() {
  setLocalData(storageKeys.pomodoro, state.pomodoro);
}

function setDuration(minutes) {
  state.pomodoro.duration = minutes;
  state.pomodoro.remaining = minutes * 60;
  state.pomodoro.isRunning = false;
  clearInterval(state.pomodoro.intervalId);
  state.pomodoro.intervalId = null;
  state.pomodoroSession.textContent = 'Ready';
  dom.durationBtns.forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.minutes) === minutes);
    button.setAttribute('aria-pressed', Number(button.dataset.minutes) === minutes);
  });
  savePomodoro();
  renderPomodoro();
}

function startPomodoro() {
  if (state.pomodoro.isRunning) return;
  state.pomodoro.isRunning = true;
  dom.pomodoroSession.textContent = 'Focus';
  dom.pomodoroPause.disabled = false;
  state.pomodoro.intervalId = setInterval(() => {
    if (state.pomodoro.remaining <= 0) {
      clearInterval(state.pomodoro.intervalId);
      state.pomodoro.isRunning = false;
      state.pomodoro.remaining = state.pomodoro.duration * 60;
      state.pomodoro.sessions += 1;
      savePomodoro();
      playFinishSound();
      showToast('Pomodoro session finished!', 'success');
      renderPomodoro();
      return;
    }
    state.pomodoro.remaining -= 1;
    renderPomodoro();
  }, 1000);
  savePomodoro();
  renderPomodoro();
}

function pausePomodoro() {
  if (!state.pomodoro.isRunning) return;
  state.pomodoro.isRunning = false;
  clearInterval(state.pomodoro.intervalId);
  state.pomodoro.intervalId = null;
  savePomodoro();
  renderPomodoro();
  showToast('Timer paused', 'warning');
}

function resetPomodoro() {
  state.pomodoro.isRunning = false;
  clearInterval(state.pomodoro.intervalId);
  state.pomodoro.intervalId = null;
  state.pomodoro.remaining = state.pomodoro.duration * 60;
  savePomodoro();
  renderPomodoro();
  showToast('Timer reset', 'success');
}

function playFinishSound() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audio = new AudioCtx();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.type = 'sine';
  oscillator.frequency.value = 440;
  gain.gain.value = 0.15;
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.35);
  oscillator.onended = () => { audio.close(); };
}

function renderHabits() {
  dom.habitsGrid.innerHTML = state.habits.map((habit) => {
    return `
      <article class="habit-card ${habit.checked ? 'checked' : ''}" data-habit-id="${habit.id}">
        <div class="habit-header">
          <span class="habit-emoji">${habit.emoji}</span>
          <div>
            <div class="habit-name">${escapeHtml(habit.name)}</div>
            <div class="habit-streak">Streak: ${habit.streak}</div>
          </div>
        </div>
        <button class="habit-check-btn" type="button">${habit.checked ? 'Completed today' : 'Mark done'}</button>
      </article>
    `;
  }).join('');
}

function saveHabits() {
  setLocalData(storageKeys.habits, state.habits);
}

function toggleHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;
  const today = habitDateKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const hasCheckedToday = habit.lastChecked === today;

  if (hasCheckedToday) {
    habit.checked = false;
  } else {
    habit.checked = true;
    habit.streak = habit.lastChecked === yesterday ? habit.streak + 1 : 1;
    habit.lastChecked = today;
  }

  saveHabits();
  renderHabits();
  showToast(habit.checked ? `${habit.name} completed today` : `${habit.name} unchecked`, 'success');
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="toast-icon">${type === 'success' ? '✔' : type === 'warning' ? '⚠' : '✖'}</span><span>${message}</span>`;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2500);
}

function showSection(sectionId) {
  dom.sections.forEach((section) => {
    section.classList.toggle('active', section.id === sectionId);
  });
  dom.navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.section === sectionId.replace('section-', ''));
  });
  if (window.innerWidth < 768) dom.sidebar.classList.remove('open');
}

function handleSectionNavigation(event) {
  const target = event.target.closest('.nav-item');
  if (!target) return;
  showSection(`section-${target.dataset.section}`);
}

function initConfettiCanvas() {
  const canvas = dom.confettiCanvas;
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    state.confetti.particles.forEach((particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      ctx.restore();
    });
  }

  function update() {
    state.confetti.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;
      particle.vy += 0.05;
    });
    state.confetti.particles = state.confetti.particles.filter((item) => item.y < window.innerHeight + 40);
    draw();
    if (state.confetti.particles.length > 0) {
      state.confetti.rafId = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      state.confetti.active = false;
      state.confetti.rafId = null;
    }
  }

  function launch() {
    if (state.confetti.active) return;
    state.confetti.active = true;
    const colors = ['#7C9E87', '#C9974A', '#B07070', '#5E9BB5', '#8B7EC8'];
    const count = 80;
    state.confetti.particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * 100,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * Math.PI * 2,
      spin: Math.random() * 0.08 - 0.04,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    update();
    setTimeout(() => { state.confetti.particles = []; }, 2400);
  }

  return launch;
}

function launchConfetti() {
  confettiLauncher();
}

function initThemeAndAccent() {
  const savedTheme = getLocalData(storageKeys.theme, null) || 'dark';
  const savedAccent = getLocalData(storageKeys.accent, null) || 'sage';
  setTheme(savedTheme);
  setAccent(savedAccent);
}

function loadStoredState() {
  state.tasks = getLocalData(storageKeys.tasks, []);
  state.notes = getLocalData(storageKeys.notes, []);
  state.goal = getLocalData(storageKeys.goal, state.goal);
  state.habits = getLocalData(storageKeys.habits, state.habits);
  state.pomodoro = getLocalData(storageKeys.pomodoro, state.pomodoro);
  if (!state.pomodoro || typeof state.pomodoro.duration !== 'number') {
    state.pomodoro = { duration: 25, remaining: 25 * 60, isRunning: false, intervalId: null, sessions: 0 };
  }
  if (!state.pomodoro.remaining) state.pomodoro.remaining = state.pomodoro.duration * 60;
  state.weatherCity = getLocalData(storageKeys.weatherCity, state.weatherCity);
  state.quoteIndex = getLocalData(storageKeys.quoteIndex, 0);
  if (state.notes.length) state.activeNoteId = state.notes[0].id;
}

function bindEvents() {
  dom.themeToggle.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  dom.themeToggleMobile.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  dom.swatches.forEach((button) => {
    button.addEventListener('click', () => setAccent(button.dataset.color));
  });
  dom.hamburger.addEventListener('click', () => dom.sidebar.classList.toggle('open'));
  dom.sidebar.addEventListener('click', handleSectionNavigation);
  dom.calPrev.addEventListener('click', () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
    renderCalendar();
  });
  dom.calNext.addEventListener('click', () => {
    state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
    renderCalendar();
  });
  dom.nextQuoteBtn.addEventListener('click', nextQuote);
  dom.fetchWeatherBtn.addEventListener('click', () => fetchWeather(dom.weatherCityInput.value.trim() || state.weatherCity));
  dom.weatherCityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') fetchWeather(dom.weatherCityInput.value.trim() || state.weatherCity);
  });
  dom.addTaskBtn.addEventListener('click', () => addTask(dom.taskInput.value));
  dom.taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTask(dom.taskInput.value);
  });
  dom.taskSearch.addEventListener('input', renderTasks);
  dom.taskSort.addEventListener('change', renderTasks);
  dom.taskList.addEventListener('click', (event) => {
    const taskElement = event.target.closest('[data-task-id]');
    if (!taskElement) return;
    const id = taskElement.dataset.taskId;

    if (event.target.matches('.task-toggle')) {
      toggleTask(id);
      return;
    }
    if (event.target.matches('.task-delete')) {
      deleteTask(id);
      return;
    }
    if (event.target.matches('.task-btn.edit')) {
      enableTaskEdit(id);
      return;
    }
  });
  dom.taskList.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.matches('.task-edit-input')) {
      const id = event.target.dataset.editId;
      saveTaskEdit(id, event.target.value);
    }
  });
  dom.taskList.addEventListener('blur', (event) => {
    if (event.target.matches('.task-edit-input')) {
      const id = event.target.dataset.editId;
      saveTaskEdit(id, event.target.value);
    }
  }, true);

  dom.saveGoalBtn.addEventListener('click', saveGoal);
  dom.editGoalBtn.addEventListener('click', editGoal);
  dom.goalDone.addEventListener('change', toggleGoalDone);

  dom.newNoteBtn.addEventListener('click', createNote);
  dom.notesList.addEventListener('click', (event) => {
    const note = event.target.closest('[data-note-id]');
    if (note) selectNote(note.dataset.noteId);
  });
  dom.deleteNoteBtn.addEventListener('click', deleteNote);
  dom.noteTitleInput.addEventListener('input', scheduleNoteSave);
  dom.noteBodyInput.addEventListener('input', scheduleNoteSave);

  dom.pomodoroStart.addEventListener('click', startPomodoro);
  dom.pomodoroPause.addEventListener('click', pausePomodoro);
  dom.pomodoroReset.addEventListener('click', resetPomodoro);
  dom.durationBtns.forEach((button) => {
    button.addEventListener('click', () => setDuration(Number(button.dataset.minutes)));
  });

  dom.habitsGrid.addEventListener('click', (event) => {
    const card = event.target.closest('[data-habit-id]');
    if (!card) return;
    toggleHabit(card.dataset.habitId);
  });

  document.addEventListener('keydown', (event) => {
    if (!event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key.toLowerCase() === 'n') {
      event.preventDefault();
      createNote();
      return;
    }
    if (event.key.toLowerCase() === 't') {
      event.preventDefault();
      dom.taskInput.focus();
      addTask(dom.taskInput.value);
      return;
    }
    if (event.key.toLowerCase() === 'd') {
      event.preventDefault();
      setTheme(state.theme === 'dark' ? 'light' : 'dark');
      return;
    }
  });
}

function initializeWidgets() {
  renderCalendar();
  renderQuote(state.quoteIndex);
  fetchWeather(state.weatherCity);
  renderTasks();
  loadGoal();
  renderNotes();
  renderPomodoro();
  renderHabits();
}

const confettiLauncher = initConfettiCanvas();

function initializeApp() {
  loadStoredState();
  initThemeAndAccent();
  startClock();
  bindEvents();
  initializeWidgets();
  if (!state.notes.length) createNote();
}

initializeApp();
