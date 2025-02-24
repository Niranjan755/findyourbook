const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const genreButtons = document.querySelectorAll('.genre-button');
const suggestionsList = document.getElementById('suggestions-list');
const quoteElement = document.getElementById('quote');

const quotes = [
  "“The more that you read, the more things you will know. The more that you learn, the more places you’ll go.” — Dr. Seuss",
  "“A room without books is like a body without a soul.” — Cicero",
  "“You can never get a cup of tea large enough or a book long enough to suit me.” — C.S. Lewis",
  "“That's the thing about books. They let you travel without moving your feet.” — Jhumpa Lahiri",
  "“If you don’t like to read, you haven’t found the right book.” — J.K. Rowling",
  "“There is no friend as loyal as a book.” — Ernest Hemingway",
  "“A book is a dream you hold in your hand.” — Neil Gaiman",
  "“So many books, so little time.” — Frank Zappa",
  "“I cannot live without books.” — Thomas Jefferson",
  "“Once you learn to read, you will be forever free.” — Frederick Douglass"
];

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

quoteElement.textContent = getRandomQuote(); // Set quote on page load

searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value;
  searchBooks(searchTerm);
});

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value;
  if (searchTerm.length > 2) {
    fetchSuggestions(searchTerm);
  } else {
    suggestionsList.style.display = 'none';
  }
});

function fetchSuggestions(searchTerm) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=5`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displaySuggestions(data.items);
    })
    .catch(error => {
      console.error('Error fetching suggestions:', error);
      suggestionsList.style.display = 'none';
    });
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = '';
  if (suggestions && suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      const listItem = document.createElement('li');
      listItem.textContent = suggestion.volumeInfo.title;
      listItem.addEventListener('click', () => {
        searchInput.value = suggestion.volumeInfo.title;
        searchBooks(suggestion.volumeInfo.title);
        suggestionsList.style.display = 'none';
      });
      suggestionsList.appendChild(listItem);
    });
    suggestionsList.style.display = 'block';
  } else {
    suggestionsList.style.display = 'none';
  }
}

function searchBooks(searchTerm) {
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayResults(data.items);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      resultsContainer.innerHTML = '<p>An error occurred while fetching books.</p>';
    });
}

function displayResults(books) {
  resultsContainer.innerHTML = '';

  if (!books || books.length === 0) {
    resultsContainer.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const bookCard = createBookCard(book);
    resultsContainer.appendChild(bookCard);
  });
}

function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.classList.add('book-card');

  if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
    const img = document.createElement('img');
    img.src = book.volumeInfo.imageLinks.thumbnail;
    img.alt = book.volumeInfo.title;
    bookCard.appendChild(img);
  }

  const title = document.createElement('h3');
  title.textContent = book.volumeInfo.title;
  bookCard.appendChild(title);

  if (book.volumeInfo.authors) {
    const authors = document.createElement('p');
    authors.textContent = `By: ${book.volumeInfo.authors.join(', ')}`;
    bookCard.appendChild(authors);
  }

  if (book.volumeInfo.description) {
    const description = document.createElement('p');
    description.textContent = book.volumeInfo.description.substring(0, 150) + '...';
    bookCard.appendChild(description);
  }

  return bookCard;
}

genreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const genre = button.dataset.genre;
    searchBooks(genre);
  });
});