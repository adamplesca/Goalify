let selectedGoals = [];

//generate the calendar based on goal results
function generateCalendar() {
    const calendarHeader = document.getElementById('calendarHeader');
    const calendar = document.getElementById('calendar');
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth(); //0 index (jan = 0)
    const today = now.getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    calendarHeader.textContent = `${monthNames[month]} ${year}`;
    calendar.innerHTML = '';

    //add weekday headers (mon - sun)
    daysOfWeek.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.style.fontWeight = 'bold';
        dayElem.textContent = day;
        calendar.appendChild(dayElem);
    });

    const firstDay = new Date(year, month, 1).getDay(); //which day 1st is on
    const totalDays = new Date(year, month + 1, 0).getDate(); //days in this month

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    //add each day w/ results (succ, fail, today)
    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');

    for (let day = 1; day <= totalDays; day++) {
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.textContent = day;

        const key = `${year}-${month + 1}-${day}`;
        const result = goalResults[key];

        if (day === today) {
            dayElem.classList.add('calendar-today');
        } else if (result === 's') {
            dayElem.classList.add('calendar-success');
        } else if (result === 'f') {
            dayElem.classList.add('calendar-failure');
        }

        calendar.appendChild(dayElem);
    }
}

//save current goal checkbox states to localStorage
function saveGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');
    const todayKey = new Date().toISOString().split('T')[0];

    const goalsData = [];

    for (let goalDiv of goalDivs) {
        const checkBox = goalDiv.querySelector('.goal-checkbox');
        const goalTextDiv = goalDiv.querySelector('.goal-text');

        let existingGoal = goalsData.find(g => g.text === goalTextDiv.textContent);
        if (!existingGoal) {
            existingGoal = {
                text: goalTextDiv.textContent,
                history: {}
            };
        }

        if (checkBox.checked) {
            existingGoal.history[todayKey] = true;
        }

        goalsData.push(existingGoal);
    }

    localStorage.setItem('goals', JSON.stringify(goalsData));
}

//load goals from localStorage & show in UI
function loadGoals() {
    const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    const todayKey = new Date().toISOString().split('T')[0];
    const goalsContainer = document.getElementById('goalsContainer');

    storedGoals.forEach(goalData => {
        const goalDiv = document.createElement('div');
        goalDiv.classList.add('goal-item');

        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.classList.add('goal-checkbox');
        checkBox.checked = goalData.history && goalData.history[todayKey];

        //save & update checkbox tracker once checkbox clicked
        checkBox.addEventListener('change', () => {
            saveGoals();
            updateGoalTracker();
        });

        const goalTextDiv = document.createElement('div');
        goalTextDiv.classList.add('goal-text');
        goalTextDiv.textContent = goalData.text;

        goalDiv.appendChild(checkBox);
        goalDiv.appendChild(goalTextDiv);

        //styling added on click
        goalDiv.addEventListener('click', function () {
            if (selectedGoals.includes(goalDiv)) {
                selectedGoals = selectedGoals.filter(item => item !== goalDiv);
                goalDiv.style.border = '1px solid #ccc';
            } else {
                selectedGoals.push(goalDiv);
                goalDiv.style.border = '2px solid #0077cc';
            }
        });

        goalsContainer.appendChild(goalDiv);
    });

    updateGoalTracker();
}

//user creates goals
function createGoal() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalText = prompt("Enter the name of your goal:");
    if (!goalText || goalText.trim() === "") return;

    const trimmedText = goalText.trim().toLowerCase();

    //check for goal dupes
    const existingGoals = goalsContainer.getElementsByClassName('goal-text');
    for (let existing of existingGoals) {
        if (existing.textContent.trim().toLowerCase() === trimmedText) {
            alert("That goal already exists.");
            return;
        }
    }

    const goalDiv = document.createElement('div');
    goalDiv.classList.add('goal-item');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList.add('goal-checkbox');
    checkBox.addEventListener('change', () => {
        saveGoals();
        updateGoalTracker();
    });

    const goalTextDiv = document.createElement('div');
    goalTextDiv.classList.add('goal-text');
    goalTextDiv.textContent = goalText.trim();

    goalDiv.appendChild(checkBox);
    goalDiv.appendChild(goalTextDiv);

    //selection on click (blue border when clicking goal)
    goalDiv.addEventListener('click', function () {
        if (selectedGoals.includes(goalDiv)) {
            selectedGoals = selectedGoals.filter(item => item !== goalDiv);
            goalDiv.style.border = '1px solid #ccc';
        } else {
            selectedGoals.push(goalDiv);
            goalDiv.style.border = '2px solid #0077cc';
        }
    });

    goalsContainer.appendChild(goalDiv);
    saveGoals();
    updateGoalTracker();
}

//delete selected goals from localStorage & UI
function deleteGoals() {
    if (selectedGoals.length > 0) {
        selectedGoals.forEach(goal => goal.remove());
        selectedGoals = [];
        saveGoals();
        updateGoalTracker();
    } else {
        alert("Please select at least one goal to delete.");
    }
}

//updates goal tracker UI
function updateGoalTracker() {
    const goalsContainer = document.getElementById('goalsContainer');
    const allGoals = goalsContainer.getElementsByClassName('goal-item');

    let total = allGoals.length;
    let completed = 0;

    for (let goal of allGoals) {
        const checkbox = goal.querySelector('.goal-checkbox');
        if (checkbox && checkbox.checked) {
            completed++;
        }
    }

    const trackerDiv = document.getElementById('goalsTrackerContainer');
    trackerDiv.textContent = `Goals Completed: ${completed}/${total}`;
}

//calcs succ/fail for day & stores data
function logDailyResults(date = new Date()) {
    const storedGoals = JSON.parse(localStorage.getItem('goals') || '[]');
    const key = date.toISOString().split('T')[0];

    let total = storedGoals.length;
    let completed = 0;

    for (let goal of storedGoals) {
        if (goal.history && goal.history[key]) {
            completed++;
        }
    }

    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const result = percentage === 100 ? 's' : 'f';

    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    goalResults[`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`] = result;
    localStorage.setItem('goalResults', JSON.stringify(goalResults));
}

//log missed days when loading website
function logMissedDays() {
    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const key = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    if (!goalResults[key]) {
        logDailyResults(yesterday);
    }
}

//reset goals at midnight & uncheck goals
function resetDailyGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');

    for (let goalDiv of goalDivs) {
        const checkbox = goalDiv.querySelector('.goal-checkbox');
        if (checkbox) checkbox.checked = false;
    }

    saveGoals();
    updateGoalTracker();
    generateCalendar();
}

//midnight reset & goal logging based off timer
function scheduleMidnightReset() {
    const now = new Date();

    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); //every midnight

    const logTime = new Date(midnight);
    logTime.setMinutes(logTime.getMinutes() - 10); //checks goals 10 mins before midnight(solves bug)

    const timeUntilLog = logTime - now;
    const timeUntilReset = midnight - now;

    //logs before reset
    setTimeout(() => {
        updateGoalTracker();
        logDailyResults();
    }, timeUntilLog);
    
    //resets goals & reschedules for next day
    setTimeout(() => {
        resetDailyGoals();
        scheduleMidnightReset();
    }, timeUntilReset);
}

//page load setup 
window.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    loadGoals();
    scheduleMidnightReset();
    logMissedDays();
});

document.getElementById('createGoalBtn').addEventListener('click', createGoal);
document.getElementById('deleteGoalBtn').addEventListener('click', deleteGoals);