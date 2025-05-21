const QUOTES_URL = 'quotes.json';

const quoteEl  = document.getElementById('quote');
const authorEl = document.getElementById('author');
const btn      = document.getElementById('new-quote');
const bgMusic  = document.getElementById('bg-music');

bgMusic.volume = 0.2;

let quotesData = {};
let musicStarted = false;

let shownQuotes = [];

fetch(QUOTES_URL)
  .then(response => {
    if (!response.ok) throw new Error('Impossibile caricare le citazioni');
    return response.json();
  })
  .then(data => {
    quotesData = data;
    showRandomQuote();
  })
  .catch(err => {
    quoteEl.textContent = 'Errore nel caricamento.';
    console.error(err);
  });

function showRandomQuote() {
  if (shownQuotes.length === 0) {
    const allQuotesCount = getAllQuotesCount();
    const allQuotesShown = (shownQuotes.length > 0 && shownQuotes.length >= allQuotesCount);
    
    if (allQuotesShown) {
      shownQuotes = [];
    }
  }

  const authors = Object.keys(quotesData);
  let randomAuthor, quotesList, randomQuote, quoteId;
  let found = false;

  while (!found) {
    randomAuthor = authors[Math.floor(Math.random() * authors.length)];
    quotesList = quotesData[randomAuthor];
    
    const availableQuotes = [];
    for (let i = 0; i < quotesList.length; i++) {
      quoteId = `${randomAuthor}:${i}`;
      if (!shownQuotes.includes(quoteId)) {
        availableQuotes.push({ index: i, quote: quotesList[i] });
      }
    }
    
    if (availableQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuotes.length);
      const selectedQuote = availableQuotes[randomIndex];
      randomQuote = selectedQuote.quote;
      quoteId = `${randomAuthor}:${selectedQuote.index}`;
      found = true;
    }
    
    if (!found && getAllQuotesCount() <= shownQuotes.length) {
      shownQuotes = [];
      found = true;
      return showRandomQuote();
    }
  }

  shownQuotes.push(quoteId);

  quoteEl.textContent = `"${randomQuote}"`;
  authorEl.textContent = `— ${randomAuthor}`;
}

function getAllQuotesCount() {
  let count = 0;
  const authors = Object.keys(quotesData);
  for (const author of authors) {
    count += quotesData[author].length;
  }
  return count;
}

btn.addEventListener('click', () => {
  showRandomQuote();
  if (!musicStarted) {
    bgMusic.play().catch(err => console.warn('Autoplay bloccato:', err));
    musicStarted = true;
  }
});