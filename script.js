// Percorso al file JSON (come prima)
const QUOTES_URL = 'quotes.json';

// Elementi DOM
const quoteEl  = document.getElementById('quote');
const authorEl = document.getElementById('author');
const btn      = document.getElementById('new-quote');
const bgMusic  = document.getElementById('bg-music');

// Abbassa il volume al 20%
bgMusic.volume = 0.2;

let quotesData = {};
let musicStarted = false;

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
  const authors      = Object.keys(quotesData);
  const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
  const quotesList   = quotesData[randomAuthor];
  const randomQuote  = quotesList[Math.floor(Math.random() * quotesList.length)];

  quoteEl.textContent  = `"${randomQuote}"`;
  authorEl.textContent = `— ${randomAuthor}`;
}

// Gestore del click: nuova citazione + avvia musica se non già partita
btn.addEventListener('click', () => {
  showRandomQuote();
  if (!musicStarted) {
    bgMusic.play().catch(err => console.warn('Autoplay bloccato:', err));
    musicStarted = true;
  }
});