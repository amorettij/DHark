// Percorso al file JSON
const QUOTES_URL = 'quotes.json';

// Elementi DOM
const quoteEl  = document.getElementById('quote');
const authorEl = document.getElementById('author');
const btn      = document.getElementById('new-quote');

let quotesData = {};

// Carica le citazioni da JSON
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

// Mostra una citazione a caso
function showRandomQuote() {
  const authors = Object.keys(quotesData);
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  const quotesList   = quotesData[randomAuthor];
  const randomQuote  = quotesList[Math.floor(Math.random() * quotesList.length)];

  quoteEl.textContent  = `"${randomQuote}"`;
  authorEl.textContent = `— ${randomAuthor}`;
}

// Al click mostra una nuova citazione
btn.addEventListener('click', showRandomQuote);