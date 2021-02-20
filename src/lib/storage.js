/**
 * Get a list of all books saved to localstorage.
 *
 * @returns {Array.<string>}
 */
export function getBooks() {
  return JSON.parse(localStorage.getItem('readfast_books') || '[]');
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

    localStorage.setItem('readfast_books', JSON.stringify(books));
    localStorage.setItem(`readfast_book_${title}`, event.target.result);
  };

  reader.readAsDataURL(epub);
}

export function loadBookFile(title) {
  return localStorage.getItem(`readfast_book_${title}`);
  // const encodedBook = localStorage.getItem(`readfast_book_${title}`);
  // const parts = encodedBook.split(',');
  // const type = parts[0].split(';')[1];
  // const content = parts[1];
  // console.log({ content });
  // return new File([content], title, { type });
}
