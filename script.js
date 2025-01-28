
// ================================================= SETUP VARIABLES ==================================================== //

// select card-container elements
const cardContainer = document.querySelector('.card-container');

// create array of cards
const cards = ['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩'];
const hardCards = ['👽', '👹', '🤑', '🙌', '😭', '🧙', '👀', '💩', '👾', '😍', '🤬', '💋'];

let selected_cards_set = cards; // default card set

// duplicate the cards array
const cardPairs = [...cards, ...cards]; // ES6 spread operator boi! Makes life easier
const hardCardPairs = [...hardCards, ...hardCards];

// empty array to store flipped cards, and counter for matched pairs
let flippedCards = [];
let matchedPairs = 0;

// randomize the array's item positions
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5); // ES6 arrow func inside arrow func
// shuffleArray takes in (arr), return the sorted array, with the sort criteria based on another func

// counter for moves 
moveCounter = document.querySelector('.moves');

// Audio
const flip_audio = new Audio('/assets/bgm/card-flip-SE.mp3');
const win_audio = new Audio('/assets/bgm/victory-SE.mp3');


// ==================================================== GAME LOGIC ========================================================== //


// Create and display cards
function createCards() {
  const shuffledCards = shuffleArray(cardPairs); // shuffle here so it resets every time createCards() is called
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
    if (matchedPairs === selected_cards_set.length) {
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
    createCards(); // Create new cards
    moveCounter.textContent = 0; // Reset move counter
    matchedPairs = 0; // Reset matched pairs counter
    currentSkin = 0; // Reset card skin
    timerSeconds = 0; // Reset timer
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

// Function to start the timer
function startTimer() {
    let timerInterval;  
    timerInterval = setInterval(() => {     // JS setInterval() takes in 2 arguments: a function to be executed, and a time in milliseconds to repeat that function
    timerSeconds++;
    document.querySelector('.timer').textContent = timerSeconds;
  }, 1000); // Update every 1 second
}

// ------------------- HARD MODE ------------------- //
function hardMode() {
    selected_cards_set = hardCards; // change card set to hard mode, don't use 'let' here or it will create a new variable and not update the global one
    cardContainer.innerHTML = ''; // Clear all cards
    const shuffledCards = shuffleArray(hardCardPairs); // shuffle here so it resets every time createCards() is called
    shuffledCards.forEach((card) => {
      const li = document.createElement('li');
      li.classList.add('card');
      li.textContent = card;
      li.addEventListener('click', flipCard); // execute flipcard() when clicked
      cardContainer.appendChild(li);
    });
}

// Attach an event listener to hard mode button
const hardModeButton = document.querySelector('.hard-mode');
hardModeButton.addEventListener('click', hardMode);

// Initialize game
createCards();
startTimer();