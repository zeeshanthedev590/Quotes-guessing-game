const form = document.getElementById("myForm");
const userInput = document.getElementById("userInput");
const submitBtn = document.querySelector("button[type='submit']");
const quote = document.getElementById("quote");
const newQuoteBtn = document.getElementById("newQuoteBtn");

let random;
let quoteText;
let score = 0;
scoreDisplay.innerHTML = score.toString();
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function fetchQuote() {
  fetch("./quotes.json")
    .then((response) => response.json())
    .then((response) => {
      random = Math.floor(Math.random() * 100);
      quoteText = response[random].Quote;
      quote.innerHTML = quoteText;
      newQuoteBtn.style.display = "none";
      userInput.disabled = false;
      userInput.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
}

fetchQuote();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const userAnswer = userInput.value.toLowerCase();
  fetch("./quotes.json")
    .then((response) => response.json())
    .then((response) => {
      const correctAnswer = response[random].Author.toLowerCase();
      answer.style.display = "inline";
      const distance = levenshteinDistance(userAnswer, correctAnswer);
      if (distance <= 9) {
        // Adjust the threshold as per your requirements
        answer.innerHTML = `Correct answer! The answer indeed is: ${correctAnswer}`;
        newQuoteBtn.style.display = "inline";
        score++;
        scoreDisplay.textContent = score.toString();
      } else {
        answer.innerHTML = `Incorrect answer! The answer was: ${correctAnswer}`;
        newQuoteBtn.style.display = "inline";
      }
      userInput.disabled = true;
      submitBtn.disabled = true;
    })
    .catch((error) => {
      console.log(error);
    });
});

newQuoteBtn.addEventListener("click", function () {
  fetchQuote();
  submitBtn.disabled = false;
  answer.style.display = "none";
});
