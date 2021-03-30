/**
 * Get a list of all books saved to localstorage.
 *
 * @returns {Array.<string>}
 */
export function getBooks() {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  return JSON.parse(localStorage.getItem('read_fast_books') || '[]');
}

/**
 * Save the book to localstorage if necessary.
 *
 * @param {{book: Book}}
 */
export function saveBook(epub, title) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const books = getBooks();
    books.push(title);

    localStorage.setItem('read_fast_books', JSON.stringify(books));
    localStorage.setItem(`read_fast_book:${title}`, event.target.result);
  };

  reader.readAsDataURL(epub);
}

export function loadBookFile(title) {
  return localStorage.getItem(`read_fast_book:${title}`);
}
