document.getElementById('createGoalBtn').addEventListener('click', createGoal);
document.getElementById('deleteGoalBtn').addEventListener('click', deleteGoals);

//array to store selected goals for deletion
let selectedGoals = []; 
//load goals from localStorage when the page loads
window.onload = loadGoals;


function createGoal() {
    const goalsContainer = document.getElementById('goalsContainer');
    
    //prompt user for goal text
    const goalText = prompt("Enter the name of your goal:");
    if (!goalText || goalText.trim() === "") return; // Don't add empty goals

    //create new goal div
    const goalDiv = document.createElement('div');
    goalDiv.classList.add('goal-item');

    //create checkbox input element
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.classList.add('goal-checkbox');
    checkBox.addEventListener('change', () => {
        saveGoals();
        updateGoalStats();
    });

    //create text container div
    const goalTextDiv = document.createElement('div');
    goalTextDiv.classList.add('goal-text');
    goalTextDiv.textContent = goalText; // Use user input

    //add checkbox & text to the goal div
    goalDiv.appendChild(checkBox);
    goalDiv.appendChild(goalTextDiv);

    //add click event to toggle selection (choose what goals to delete)
    goalDiv.addEventListener('click', function () {
        if (selectedGoals.includes(goalDiv)) {
            selectedGoals = selectedGoals.filter(item => item !== goalDiv);
            goalDiv.style.border = '1px solid #ccc';
        } else {
            selectedGoals.push(goalDiv);
            goalDiv.style.border = '2px solid #0077cc';
        }
    });

    //add the new goal div to the container
    goalsContainer.appendChild(goalDiv);

    //save the new goal to localStorage + update tracker
    saveGoals();
    updateGoalTracker();
}
function deleteGoals() {
    if (selectedGoals.length > 0) {
        //remove selected goals from DOM & localStorage
        selectedGoals.forEach(goal => {
            goal.remove();
        });
        selectedGoals = []; //reset selected goals array
        saveGoals(); //update localStorage after deletion + update tracker
        updateGoalTracker();
    } else {
        alert("Please select at least one goal to delete.");
    }
}

function saveGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    const goalDivs = goalsContainer.getElementsByClassName('goal-item');
    
    //creates an array to store the goal data (checkbox checked status and text)
    const goalsData = [];
    for (let goalDiv of goalDivs) {
        const checkBox = goalDiv.querySelector('.goal-checkbox');
        const goalTextDiv = goalDiv.querySelector('.goal-text');
        
        goalsData.push({
            text: goalTextDiv.textContent,
            isChecked: checkBox.checked
        });
    }
    
    //store the goals data in localStorage as json string
    localStorage.setItem('goals', JSON.stringify(goalsData));
}

//recreates divs user had prior to loading
function loadGoals() {
    const storedGoals = localStorage.getItem('goals');
    if (storedGoals) {
        const goalsData = JSON.parse(storedGoals);
        
        //for each stored goal recreate the goal div on the page
        goalsData.forEach(goalData => {
            const goalsContainer = document.getElementById('goalsContainer');
            
            const goalDiv = document.createElement('div');
            goalDiv.classList.add('goal-item');
            
            const checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.classList.add('goal-checkbox');
            checkBox.checked = goalData.isChecked; //set the checkbox state
            checkBox.addEventListener('change', () => {
                saveGoals();
                updateGoalStats();
            });
            
            const goalTextDiv = document.createElement('div');
            goalTextDiv.classList.add('goal-text');
            goalTextDiv.textContent = goalData.text; //set the goal text
            
            goalDiv.appendChild(checkBox);
            goalDiv.appendChild(goalTextDiv);
            
            goalDiv.addEventListener('click', function() {
                if (selectedGoals.includes(goalDiv)) {
                    selectedGoals = selectedGoals.filter(item => item !== goalDiv);
                    goalDiv.style.border = '1px solid #ccc'; //reset border color
                } else {
                    selectedGoals.push(goalDiv);
                    goalDiv.style.border = '2px solid rgb(255, 0, 0)'; //highlight selected goal
                }
            });
            
            //add the new goal div to the container
            goalsContainer.appendChild(goalDiv);
        });
    }
    updateGoalTracker();
}

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

