document.getElementById('createGoalBtn').addEventListener('click', createGoal);
document.getElementById('deleteGoalBtn').addEventListener('click', deleteGoals);

//stores goals to be deleted & loads goals from local storage when the page loads
let selectedGoals = [];
window.onload = () => {
    loadGoals();  
    scheduleMidnightReset();
};

//create a new goal div with savable checkbox & custom goal name
function createGoal() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalText = prompt("Enter the name of your goal:");
    if (!goalText || goalText.trim() === "") return;  //add nothing if blank

    const goalDiv = document.createElement('div');
    goalDiv.classList.add('goal-item');  //add a class for styling

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList.add('goal-checkbox');
    checkBox.addEventListener('change', () => {
        saveGoals();  //save goals whenever the checkbox is ticked
        updateGoalStats();  //update goal statistics
    });

    const goalTextDiv = document.createElement('div');
    goalTextDiv.classList.add('goal-text');
    goalTextDiv.textContent = goalText;

    //add divs to goal div
    goalDiv.appendChild(checkBox);  
    goalDiv.appendChild(goalTextDiv);  

    //add click function to select and unselect goals
    goalDiv.addEventListener('click', function () {
        if (selectedGoals.includes(goalDiv)) {
            selectedGoals = selectedGoals.filter(item => item !== goalDiv);  //deselect
            goalDiv.style.border = '1px solid #ccc';  //reset border color
        } else {
            selectedGoals.push(goalDiv);  //select 
            goalDiv.style.border = '2px solid #0077cc';
        }
    });

    goalsContainer.appendChild(goalDiv);  //add goal div to goal container div
    saveGoals();  //save goal to localStorage
    updateGoalTracker();  //update goal tracker display
}

//delete selected goals
function deleteGoals() {
    if (selectedGoals.length > 0) {
        selectedGoals.forEach(goal => goal.remove());  //remove selected goals from DOM
        selectedGoals = [];  //clear the selected goals array
        saveGoals();  //save the updated goals list to localStorage
        updateGoalTracker();  //update goal tracker display
    } else {
        alert("Please select at least one goal to delete.");
    }
}

//save the current goals to localStorage
function saveGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');

    const goalsData = [];
    for (let goalDiv of goalDivs) {
        const checkBox = goalDiv.querySelector('.goal-checkbox');
        const goalTextDiv = goalDiv.querySelector('.goal-text');
        goalsData.push({
            text: goalTextDiv.textContent,
            isChecked: checkBox.checked,
            lastCheckedDate: checkBox.checked ? new Date().toDateString() : null  //save last checked date if checked
        });
    }

    localStorage.setItem('goals', JSON.stringify(goalsData));  //store goals data in localStorage
}

//load saved goals from localStorage (same concept as creating goal basically)
function loadGoals() {
    const storedGoals = localStorage.getItem('goals');
    const today = new Date().toDateString();

    if (storedGoals) {
        const goalsData = JSON.parse(storedGoals);

        goalsData.forEach(goalData => {
            const goalsContainer = document.getElementById('goalsContainer');
            const goalDiv = document.createElement('div');
            goalDiv.classList.add('goal-item');

            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.classList.add('goal-checkbox');
            const isSameDay = goalData.lastCheckedDate === today;
            checkBox.checked = isSameDay && goalData.isChecked;  //keep the checkbox checked if it was checked today

            checkBox.addEventListener('change', () => {
                saveGoals();  //save goals when checkbox state changes
                updateGoalStats();  //update goal statistics
            });

            const goalTextDiv = document.createElement('div');
            goalTextDiv.classList.add('goal-text');
            goalTextDiv.textContent = goalData.text;

            goalDiv.appendChild(checkBox); 
            goalDiv.appendChild(goalTextDiv);  

            goalDiv.addEventListener('click', function () {
                if (selectedGoals.includes(goalDiv)) {
                    selectedGoals = selectedGoals.filter(item => item !== goalDiv); 
                    goalDiv.style.border = '1px solid #ccc';  
                } else {
                    selectedGoals.push(goalDiv);
                    goalDiv.style.border = '1px solid rgb(255, 0, 0)';  
                }
            });

            goalsContainer.appendChild(goalDiv);  //add loaded goal to container
        });
    }
    updateGoalTracker();  //update goal tracker
}

//update the goal tracker (completion statistics)
function updateGoalTracker() {
    const goalsContainer = document.getElementById('goalsContainer');
    const allGoals = goalsContainer.getElementsByClassName('goal-item');

    let total = allGoals.length;
    let completed = 0;

    for (let goal of allGoals) {
        const checkbox = goal.querySelector('.goal-checkbox');
        if (checkbox && checkbox.checked) {
            completed++;  //count completed goals
        }
    }

    const trackerDiv = document.getElementById('goalsTrackerContainer');
    trackerDiv.textContent = `Goals Completed: ${completed}/${total}`;  //update the tracker display
}

//schedule the reset of goals at midnight every day & log the completed goals 1 min before minight
function scheduleMidnightReset() {
    const now = new Date();

    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); //set time to midnight

    const logTime = new Date(midnight);
    logTime.setMinutes(logTime.getMinutes() - 1); //1 min before midnight to log results

    const timeUntilLog = logTime - now;
    const timeUntilReset = midnight - now;

    //log daily results 1 minute before midnight
    setTimeout(() => {
        logDailyResults();
    }, timeUntilLog);

    //reset checkboxes at midnight
    setTimeout(() => {
        resetDailyGoals();  
        scheduleMidnightReset(); //schedule next midnight reset
    }, timeUntilReset);
}

//log the results of the goals at midnight
function logDailyResults() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');

    let total = goalDivs.length;
    let completed = 0;

    for (let goalDiv of goalDivs) {
        const checkbox = goalDiv.querySelector('.goal-checkbox');
        if (checkbox && checkbox.checked) {
            completed++;  //count completed goals
        }
    }

    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;  //key for todays date
    const result = (total > 0 && completed === total) ? 'success' : 'failure';  //check if all goals are completed

    let goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    goalResults[key] = result;  //store todays result
    localStorage.setItem('goalResults', JSON.stringify(goalResults));  //save to localStorage
}

//reset all daily goals (uncheck all checkboxes)
function resetDailyGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');

    for (let goalDiv of goalDivs) {
        const checkbox = goalDiv.querySelector('.goal-checkbox');
        if (checkbox) checkbox.checked = false;  //uncheck all boxes
    }

    saveGoals();  
    updateGoalTracker();
    generateCalendar();  
}