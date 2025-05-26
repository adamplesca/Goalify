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
    "\"Keep your face always toward the sunshine, and shadows will fall behind you.\" - Walt Whitman",
    "\"Your time is limited, so don't waste it living someone else's life.\" - Steve Jobs",
    "\"The best way to predict the future is to invent it.\" - Alan Kay",
    "\"If you want to go fast, go alone. If you want to go far, go together.\" - African Proverb",
    "\"Do not wait for the perfect moment, take the moment and make it perfect.\" - Unknown",
    "\"I am not a product of my circumstances. I am a product of my decisions.\" - Stephen R. Covey",
    "\"Don't count the days, make the days count.\" - Muhammad Ali",
    "\"Discipline is the bridge between goals and accomplishment.\" - Jim Rohn",
    "\"Happiness is not something ready-made. It comes from your own actions.\" - Dalai Lama",
    "\"You miss 100% of the shots you don't take.\" - Wayne Gretzky",
    "\"Opportunities don't happen. You create them.\" - Chris Grosser",
    "\"It always seems impossible until it's done.\" - Nelson Mandela",
    "\"Success usually comes to those who are too busy to be looking for it.\" - Henry David Thoreau",
    "\"Push yourself, because no one else is going to do it for you.\" - Unknown",
    "\"Great things never come from comfort zones.\" - Unknown",
    "\"Don't limit your challenges. Challenge your limits.\" - Jerry Dunn",
    "\"Small deeds done are better than great deeds planned.\" - Peter Marshall",
    "\"You don't have to be great to start, but you have to start to be great.\" - Zig Ziglar",
    "\"Success is walking from failure to failure with no loss of enthusiasm.\" - Winston Churchill",
    "\"It's not whether you get knocked down, it's whether you get up.\" - Vince Lombardi"
];

const quoteContainer = document.getElementById("quoteContainer");

//randomly chooses a quote
function getNewQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    localStorage.setItem('quoteText', randomQuote);
    localStorage.setItem('quoteDate', new Date().toDateString()); //store only the date part
    return randomQuote;
}

function getDailyQuote() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('quoteDate');
    const savedQuote = localStorage.getItem('quoteText');

    if (savedDate !== today) {
        return getNewQuote();
    }

    return savedQuote;
}

function updateQuoteDisplay() {
    quoteContainer.textContent = getDailyQuote();
}

//updates everytime the clock hits midnight
(function scheduleMidnightUpdate() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); //midnight
    const msUntilMidnight = midnight - now;

    setTimeout(() => {
        updateQuoteDisplay();
        //schedule another one for the next day
        scheduleMidnightUpdate();
    }, msUntilMidnight);
})();

//show quote
updateQuoteDisplay();


/* 

//code to test refresh of function div

function refreshQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quoteContainer').innerText = quotes[randomIndex];
}
    
refreshQuote(); //initial quote load

setInterval(refreshQuote, 5000); //refresh every 5 seconds 

*/