
// ================================================= SETUP VARIABLES ==================================================== //

// select card-container elements
const cardContainer = document.querySelector('.card-container');

// create array of cards
const cards = ['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩'];
const hardCards = ['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩', '👾', '😍', '🤬', '💋'];
const testCards = ['👽', '👹'];

let selected_cards_set = cards; // default card set

// duplicate the cards array
const cardPairs = [...cards, ...cards]; // ES6 spread operator boi! Makes life easier
const hardCardPairs = [...hardCards, ...hardCards];
const testCardPairs = [...testCards, ...testCards];

let selected_cards_pair = cardPairs; // default card pair set

// empty array to store flipped cards, and counter for matched pairs
let flippedCards = [];
let matchedPairs = 0;

// randomize the array's item positions
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5); // ES6 arrow func inside arrow func
// shuffleArray takes in (arr), return the sorted array, with the sort criteria based on another func



// counter for moves 
moveCounter = document.querySelector('.moves');

// counter for moves across all instances
totalMoveCounter = document.querySelector('.total-moves');



// Audio
const flip_audio = new Audio('assets/card-flip-SE.mp3');
const win_audio = new Audio('assets/victory-SE.mp3');
const match_audio = new Audio('assets/match-SE.mp3');


// ==================================================== GAME LOGIC ========================================================== //


// Create and display cards
function createCards() {
  cardContainer.innerHTML = '';
  const shuffledCards = shuffleArray(selected_cards_pair); // shuffle here so it resets every time createCards() is called
  shuffledCards.forEach((card) => {
    const li = document.createElement('li');
    li.classList.add('card');
    li.textContent = card;
    li.addEventListener('click', flipCard); // execute flipcard() when clicked
    cardContainer.appendChild(li);
  });
}


// Flip card logic + update moves counter
function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) { /* 'this' refers to the card that was clicked */
    flip_audio.play();                                                  /* play flip audio when card is clicked */
    this.classList.add('flipped');                                      /* add class 'flipped' to the clicked card */
    flippedCards.push(this);                                            /* add the clicked card to the flippedCards array */            

    if (flippedCards.length === 2) {
      // Update move counter  
      moveCounter.textContent = parseInt(moveCounter.textContent) + 1; 
      saveMoveCounter(); // Save move counter to sessionStorage

      // totalMoveCounter.textContent = parseInt(totalMoveCounter.textContent) + 1;                     // DON'T DO THIS! this relies on the current totalMoveCounter of a single tab, which is not accurate
      totalMoveCounter.textContent = parseInt(localStorage.getItem('totalMoveCounter') || 0) + 1;       // use the number from local storage, or 0 if it doesn't exist, takes in consideration of all tabs
      saveTotalMoveCounter(); // Save total move counter to sessionStorage

      // Wait 0.5s before running checkMatch(), in turn, give a short delay to flip both cards back down  
      setTimeout(checkMatch, 500); 
    }
  }
}


// Check if cards match + WIN condition
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.textContent === card2.textContent) {
    card1.classList.add('matched');                 /* same old class adding stuff */
    card2.classList.add('matched');
    matchedPairs++;                                 /* increase matchedPairs counter for win condition check*/                     
    match_audio.play();                             /* play match audio when cards are matched */
    if (matchedPairs === selected_cards_set.length) {
      stopTimer();                                  /* stop timer when win*/
      win_audio.play();                             /* play win audio when all cards are matched */
      alert('You Win!');
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }

  flippedCards = [];        // empty flippedCards array after checking
}


// Restart game
function resetGame() {
    cardContainer.innerHTML = ''; // Clear all cards
    moveCounter.textContent = 0; // Reset move counter (for this game instance)
    flippedCards = []; // Reset flipped cards array
    matchedPairs = 0; // Reset matched pairs counter
    // currentSkin = 0; // Reset card skin
    timerSeconds = 0; // Reset timer
    createCards(); // Create new cards
    changeSkin(); // Change card skin
    stopTimer();  // Stop timer
    startTimer(); // Start timer
  }
  
  // Attach an event listener to the reset button
  const resetButton = document.querySelector('.restart');
  resetButton.addEventListener('click', resetGame);


// =================================================== Other game features ================================================= //


// ----------------------- Change card skin ----------------------- //

//-- https://cassidoo.co/post/styling-css-pseudo/ -- Trick to edit pseudo elements
const cardSkins = ['assets/card-back-1.png', 'assets/card-back-2.png', 'assets/card-back-3.gif', 'assets/card-back-4.gif', 'assets/card-back-5.png',
    'assets/card-back-6.gif', 'assets/card-back-7.png', 'assets/card-back-8.png', 'assets/card-back-9.png', 'assets/card-back-10.png',
    'assets/card-back-11.png', 'assets/card-back-12.png', 'assets/card-back-13.png', 'assets/card-back-14.png', 'assets/card-back-15.gif'
];

let currentSkin = 0; // Tracks the current skin index

function changeSkin() {
  const cards = document.querySelectorAll('.card'); // Select all cards, or it will only change the first card

  // Move to the next skin in the array
  currentSkin = (currentSkin + 1) % cardSkins.length; // Loop back to the first skin if at the end

  // Update the background image of the card via .setProperty instead of .backgroundImage ( thank you Cassidy Williams!)
  cards.forEach(card => {
    card.style.setProperty('--cardCover', `url('${cardSkins[currentSkin]}')`); //takes the result of cardSkins[currentSkin], not the string itself
  });
}

// Attach an event listener to change skin button
const changeSkinButton = document.querySelector('.card-skin');
changeSkinButton.addEventListener('click', changeSkin);



// ------------------- Timer Display ------------------- //

let timerSeconds = 0;           // Leave this outside of startTimer() so it can be accessed globally for resetting
let timerInterval;              // Leave this outside of startTimer() so it can be accessed globally for stopping

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {                           // JS setInterval() takes in 2 arguments: a function to be executed, and a time in milliseconds to repeat that function
    timerSeconds++;
    document.querySelector('.timer').textContent = timerSeconds;
    saveTimer();                                                  // Save the updated timer value to sessionStorage
  }, 1000);                                                       // Update every 1 second
}

// Function to stop the timer -----> make sure to stop before start, or it will double/triple count
function stopTimer() {
    clearInterval(timerInterval);                                 // clearInterval() stops the timer
}

// ------------------- DIFFICULTY ------------------- //
function switchMode(mode) {
  //cardContainer.innerHTML = ''; // Clear all cards
  resetGame(); // Reset game

  switch (mode) {
    case 'easy':
      selected_cards_set = cards;
      selected_cards_pair = cardPairs;
      cardContainer.innerHTML = '';
      break;
    case 'hard':
      selected_cards_set = hardCards;
      selected_cards_pair = hardCardPairs;
      cardContainer.innerHTML = '';
      break;
    case 'test':
      selected_cards_set = testCards;
      selected_cards_pair = testCardPairs;
      cardContainer.innerHTML = '';
      break;
    default:
      selected_cards_set = cards;
      selected_cards_pair = cardPairs;
      cardContainer.innerHTML = '';
  }

  const shuffledCards = shuffleArray(selected_cards_pair); // Shuffle the cards
  shuffledCards.forEach((card) => {
    const li = document.createElement('li');
    li.classList.add('card');
    li.textContent = card;
    li.addEventListener('click', flipCard); // Execute flipCard() when clicked
    cardContainer.appendChild(li);
  });

  changeSkin(); // Change card skin
}


// Attach event listeners to mode buttons
const hardModeButton = document.querySelector('.hard-mode');
hardModeButton.addEventListener('click', () => switchMode('hard'));

const easyModeButton = document.querySelector('.easy-mode');
easyModeButton.addEventListener('click', () => switchMode('easy'));

const testModeButton = document.querySelector('.test-mode');
testModeButton.addEventListener('click', () => switchMode('test'));


// // ==================================================== SAVE and LOAD ==================================================== //


// Load move counter from sessionStorage on page load
function loadMoveCounter() {
  const savedMoveCounter = sessionStorage.getItem('moveCounter');
  if (savedMoveCounter !== null) {
    moveCounter.textContent = savedMoveCounter; // Restore the saved move counter
  }
}

// Save move counter to sessionStorage with the name 'moveCounter'
function saveMoveCounter() {
  sessionStorage.setItem('moveCounter', moveCounter.textContent);
}

// ====================================================================================

// Load total move counter from localStorage on page load
function loadTotalMoveCounter() {
  const savedTotalMoveCounter = localStorage.getItem('totalMoveCounter');
  if (savedTotalMoveCounter !== null) {
    totalMoveCounter.textContent = savedTotalMoveCounter; // Restore the saved move counter
  }
}

// save total move counter to localStorage
function saveTotalMoveCounter() {
  localStorage.setItem('totalMoveCounter', totalMoveCounter.textContent);
}


// ====================================================================================

// load timer from sessionStorage on page load
function loadTimer() {
  const savedTimer = sessionStorage.getItem('timerSeconds');
  if (savedTimer !== null) {
    timerSeconds = parseInt(savedTimer);
    document.querySelector('.timer').textContent = timerSeconds;
  }
}

// save timer to sessionStorage
function saveTimer() {
  sessionStorage.setItem('timerSeconds', timerSeconds);
}



// ================  Load saves when the page loads =================== //
window.addEventListener('load', loadMoveCounter);
window.addEventListener('load', loadTotalMoveCounter);
window.addEventListener('load', loadTimer);

// ==================================================== GAME INITIALIZATION ==================================================== //

// Initialize game
createCards();
changeSkin();
startTimer();




