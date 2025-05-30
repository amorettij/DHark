const QUOTES_URL = 'quotes.json';

const quoteEl  = document.getElementById('quote');
const authorEl = document.getElementById('author');
const btn      = document.getElementById('new-quote');
const bgMusic  = document.getElementById('bg-music');
const container = document.querySelector('.container');

bgMusic.volume = 0.2;

let allContent = [];
let musicStarted = false;
let shownContent = [];

fetch(QUOTES_URL)
  .then(response => {
    if (!response.ok) throw new Error('Impossibile caricare le citazioni');
    return response.json();
  })
  .then(data => {
    allContent = [];
    
    if (data.quotes) {
      const quoteAuthors = Object.keys(data.quotes);
      for (const author of quoteAuthors) {
        const quotes = data.quotes[author];
        for (const quote of quotes) {
          allContent.push({
            type: 'quote',
            content: quote,
            author: author
          });
        }
      }
    }
    
    if (data.audio) {
      const audioAuthors = Object.keys(data.audio);
      for (const author of audioAuthors) {
        const audioPaths = data.audio[author];
        for (const audioPath of audioPaths) {
          allContent.push({
            type: 'audio',
            content: audioPath,
            author: author
          });
        }
      }
    }
    
    showRandomContent();
  })
  .catch(err => {
    quoteEl.textContent = 'Errore nel caricamento.';
    console.error(err);
  });

function showRandomContent() {
  if (shownContent.length >= allContent.length) {
    shownContent = [];
  }
  const availableContent = allContent.filter(item => !shownContent.includes(item.content));
  
  const randomIndex = Math.floor(Math.random() * availableContent.length);
  const selectedContent = availableContent[randomIndex];
  
  shownContent.push(selectedContent.content);
  
  if (selectedContent.type === 'audio') {
    const audioPlayerHTML = `
      <div class="audio-content">
        <audio controls autoplay>
          <source src="${selectedContent.content}" type="audio/mpeg">
          Il tuo browser non supporta l'elemento audio.
        </audio>
      </div>
    `;
    quoteEl.innerHTML = audioPlayerHTML;
    authorEl.textContent = `— ${selectedContent.author}`;
    
    bgMusic.pause();
    
    setTimeout(() => {
      const audioElement = document.querySelector('.audio-content audio');
      if (audioElement) {
        audioElement.addEventListener('ended', () => {
          bgMusic.play().catch(err => console.warn('Autoplay bloccato:', err));
        });
      }
    }, 100);
  } else {
    quoteEl.textContent = `"${selectedContent.content}"`;
    authorEl.textContent = `— ${selectedContent.author}`;
    
    if (musicStarted && bgMusic.paused) {
      bgMusic.play().catch(err => console.warn('Autoplay bloccato:', err));
    }
  }
}

btn.addEventListener('click', () => {
  showRandomContent();
  if (!musicStarted) {
    bgMusic.play().catch(err => console.warn('Autoplay bloccato:', err));
    musicStarted = true;
  }
});