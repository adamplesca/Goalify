//export data from localStorage to a downloadable json file
function exportData() {
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
    link.download = 'goal_data_backup.json'; //sets name
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

//dom setup for event listeners & displaying canvas 
document.addEventListener('DOMContentLoaded', () => {
    const chartCanvas = document.getElementById('yearlyStatsChart');
    let chartInstance = null;

    const toggleBtn = document.getElementById('yearlyStats');
    if (toggleBtn && chartCanvas) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = getComputedStyle(chartCanvas).display === 'none';

            if (isHidden) {
                chartCanvas.style.display = 'block';
                if (!chartInstance) {
                    chartInstance = generateYearlyStatsChart(chartCanvas);
                }
            } else {
                chartCanvas.style.display = 'none';
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