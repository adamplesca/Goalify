const quotes = [
    "\"The only way to do great work is to love what you do.\" - Steve Jobs",
    "\"Success is not final, failure is not fatal: It is the courage to continue that counts.\" - Winston Churchill",
    "\"Believe you can and you're halfway there.\" - Theodore Roosevelt",
    "\"Don't watch the clock; do what it does. Keep going.\" - Sam Levenson",
    "\"Everything you've ever wanted is on the other side of fear.\" - George Addair",
    "\"Start where you are. Use what you have. Do what you can.\" - Arthur Ashe",
    "\"Do what you can, with what you have, where you are.\" - Theodore Roosevelt",
    "\"It does not matter how slowly you go as long as you do not stop.\" - Confucius",
    "\"Strive not to be a success, but rather to be of value.\" - Albert Einstein",
    "\"Act as if what you do makes a difference. It does.\" - William James",
    "\"Hardships often prepare ordinary people for an extraordinary destiny.\" - C.S. Lewis",
    "\"What lies behind us and what lies before us are tiny matters compared to what lies within us.\" - Ralph Waldo Emerson",
    "\"Dream big and dare to fail.\" - Norman Vaughan",
    "\"You are never too old to set another goal or to dream a new dream.\" - C.S. Lewis",
    "\"Keep your face always toward the sunshine—and shadows will fall behind you.\" - Walt Whitman",
    "\"Your time is limited, so don’t waste it living someone else’s life.\" - Steve Jobs"
  ];

const quoteContainer = document.getElementById("quoteContainer");

function getDailyQuote() {
    const now = new Date();
    const lastSaved = localStorage.getItem('quoteDate');
    const savedQuote = localStorage.getItem('quoteText');

    const isNewDay = !lastSaved || (new Date(lastSaved)).toDateString() !== now.toDateString();

    if (isNewDay) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        localStorage.setItem('quoteText', randomQuote);
        localStorage.setItem('quoteDate', now.toString());
        return randomQuote;
    }

    return savedQuote;
}

//display the quote when the page loads
quoteContainer.textContent = getDailyQuote();



//code to test refresh of function div
/* 
function refreshQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quoteContainer').innerText = quotes[randomIndex];
}
    
refreshQuote(); //initial quote load

setInterval(refreshQuote, 5000); //refresh every 5 seconds
*/