const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results-container');
const genreButtons = document.querySelectorAll('.genre-button');
const suggestionsList = document.getElementById('suggestions-list');

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