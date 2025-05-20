function generateYearlyStatsChart(canvas) {
    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');
    const currentYear = new Date().getFullYear();
    const monthlyCounts = Array(12).fill().map(() => ({ success: 0, total: 0 }));

    for (let key in goalResults) {
        const [year, month] = key.split('-').map(Number);
        if (year === currentYear) {
            monthlyCounts[month - 1].total++;
            if (goalResults[key] === 'success') {
                monthlyCounts[month - 1].success++;
            }
        }
    }

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const data = monthlyCounts.map(({ success, total }) =>
        total === 0 ? 0 : Math.round((success / total) * 100)
    );

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
                    text: `Yearly Daily Goal Completion (${currentYear})`
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

const chartCanvas = document.getElementById('yearlyStatsChart');
let chartInstance = null;

const toggleBtn = document.getElementById('yearlyStats');

toggleBtn.addEventListener('click', () => {
    if (chartCanvas.style.display === 'none') {
        chartCanvas.style.display = 'block';
        if (!chartInstance) {
            chartInstance = generateYearlyStatsChart(chartCanvas);
        }
    } else {
        chartCanvas.style.display = 'none';
    }
});

//todo FULLY FINISH
const sidebarBtns = document.querySelectorAll('#sidebar .goalPageBtns');
sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mode = btn.textContent.trim();
        if (mode === 'Yearly Overview') {
            chartCanvas.style.display = 'block';
            if (!chartInstance) {
                chartInstance = generateYearlyStatsChart(chartCanvas);
            }
        }
    });
});