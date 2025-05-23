//export data from localStorage to a downloadable json file
function exportData() {
    const currentYear = new Date().getFullYear();
    const data = {
        goals: JSON.parse(localStorage.getItem('goals') || '[]'),
        goalResults: JSON.parse(localStorage.getItem('goalResults') || '{}')
    };

    //convert json to string 
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    //make temp url & download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `Goal_Data_${currentYear}.json`; //sets name
    link.click();

    URL.revokeObjectURL(url);
}

//import json data into localStorage 
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json'; //allows json only

    //when the user selects a file
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader(); //read file contents & makes sure its in a valid format for the website
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.goals && data.goalResults) {
                    localStorage.setItem('goals', JSON.stringify(data.goals));
                    localStorage.setItem('goalResults', JSON.stringify(data.goalResults));
                    location.reload(); //refresh UI
                } else {
                    alert("Invalid file format.");
                }
            } catch (err) {
                alert("Failed to import data. Make sure it's a valid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

//delete all data from localStorage
function wipeData() {
    if (confirm("Are you sure you want to permanently delete all goal data?")) {
        localStorage.removeItem('goals');
        localStorage.removeItem('goalResults');
        location.reload();
    }
}

//generate bar chart for monthly % completion
function generateYearlyStatsChart(canvas) {
    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    const currentYear = new Date().getFullYear();
    const monthlyCounts = Array(12).fill().map(() => ({ success: 0, total: 0 })); //array of successful days tracked to display

    for (let key in goalResults) {
        const [year, month] = key.split('-').map(Number);
        if (year === currentYear) {
            monthlyCounts[month - 1].total++; //count the logs for every month
            if (goalResults[key] === 's') {
                monthlyCounts[month - 1].success++; //count successful logs
            }
        }
    }

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    //convert logs to %
    const data = monthlyCounts.map(({ success, total }) =>
        total === 0 ? 0 : Math.round((success / total) * 100)
    );

    //creates chart.js entry
    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '% of Days All Goals Completed',
                data,
                backgroundColor: data.map(pct => {
                    if (pct >= 90) return '#2b8a3e'; //dark green
                    if (pct >= 75) return '#4caf50'; //green
                    if (pct >= 60) return '#cddc39'; //yellow-green
                    if (pct >= 45) return '#ffeb3b'; //yellow
                    if (pct >= 30) return '#ffc107'; //amber
                    if (pct >= 20) return '#ff9800'; //orange
                    if (pct >= 10) return '#f44336'; //red
                    return '#b71c1c'; //dark red
                })
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Completion %'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Monthly Goal Completion of (${currentYear})`
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.parsed.y}% of days completed`
                    }
                },
                legend: { display: false }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

//fully generates yearly calendar w/ users data displayed
function generateFullYearCalendar() {
    const container = document.getElementById('yearlyCalendarContainer');
    container.innerHTML = '';

    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    const now = new Date();
    const currentYear = now.getFullYear();
    const today = new Date(currentYear, now.getMonth(), now.getDate());

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    for (let month = 0; month < 12; month++) {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-calendar';

        const header = document.createElement('div');
        header.className = 'month-header';
        header.textContent = monthNames[month];
        monthDiv.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'month-grid';

        dayLabels.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.style.fontWeight = 'bold';
            dayCell.textContent = day;
            grid.appendChild(dayCell);
        });

        const firstDay = new Date(currentYear, month, 1).getDay();
        const daysInMonth = new Date(currentYear, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            grid.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('div');
            const key = `${currentYear}-${month + 1}-${day}`;
            const dateObj = new Date(currentYear, month, day);
            const result = goalResults[key];

            if (dateObj > today) {
                dayElem.className = 'yr-calendar-future';
            } else if (result === 's') {
                dayElem.className = 'yr-calendar-success';
            } else if (result === 'f') {
                dayElem.className = 'yr-calendar-failure';
            }

            dayElem.textContent = day;
            grid.appendChild(dayElem);
        }

        monthDiv.appendChild(grid);
        container.appendChild(monthDiv);
    }
}

//dom setup for event listeners & displaying canvas 
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('yearlyStatsChart');
    const calendarContainer = document.getElementById('yearlyCalendarContainer');
    let chartInstance = null;

    //chart toggle btn
    const toggleBtn = document.getElementById('yearlyStats');
    if (toggleBtn && chartCanvas && calendarContainer) {
        toggleBtn.addEventListener('click', () => {
            const isChartHidden = getComputedStyle(chartCanvas).display === 'none';

            if (isChartHidden) {
                // Show chart, hide calendar
                chartCanvas.style.display = 'block';
                calendarContainer.style.display = 'none';

                if (!chartInstance) {
                    chartInstance = generateYearlyStatsChart(chartCanvas);
                }
            } else {
                chartCanvas.style.display = 'none';
            }
        });
    }

    //calendar toggle btn
    const calendarBtn = document.getElementById('yearlyCalendarBtn');
    if (calendarBtn && calendarContainer && chartCanvas) {
        calendarBtn.addEventListener('click', () => {
            const isCalendarHidden = calendarContainer.style.display === 'none';
            //prevents chart overlap
            if (isCalendarHidden) {
                generateFullYearCalendar();
                calendarContainer.style.display = 'flex';
                chartCanvas.style.display = 'none';
            } else {
                calendarContainer.style.display = 'none';
            }
        });
    }

    //bind btns to correct functions
    const exportBtn = document.getElementById('exportDataBtn');
    const importBtn = document.getElementById('importDataBtn');
    const wipeBtn = document.getElementById('wipeDataBtn');

    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (importBtn) importBtn.addEventListener('click', importData);
    if (wipeBtn) wipeBtn.addEventListener('click', wipeData);
});