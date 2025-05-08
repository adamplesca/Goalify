function generateCalendar() {
    const calendarHeader = document.getElementById('calendarHeader');
    const calendar = document.getElementById('calendar');
    const now = new Date();

    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    calendarHeader.textContent = `${monthNames[month]} ${year}`;
    calendar.innerHTML = '';

    daysOfWeek.forEach(day => {
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.style.fontWeight = 'bold';
        dayElem.textContent = day;
        calendar.appendChild(dayElem);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        calendar.appendChild(emptyCell);
    }

    const goalResults = JSON.parse(localStorage.getItem('goalResults') || '{}');

    for (let day = 1; day <= totalDays; day++) {
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.textContent = day;

        const key = `${year}-${month}-${day}`;
        const result = goalResults[key];

        if (day === today) {
            dayElem.classList.add('calendar-today');
        } else if (result === 'success') {
            dayElem.classList.add('calendar-success');
        } else if (result === 'failure') {
            dayElem.classList.add('calendar-failure');
        }

        calendar.appendChild(dayElem);
    }
}

window.addEventListener('DOMContentLoaded', generateCalendar);