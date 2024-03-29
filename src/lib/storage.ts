/**
 * Get a list of all books saved to localstorage.
 *
 * @returns {string[]}
 */
export function getBooks(): string[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }

  return JSON.parse(localStorage.getItem('read_fast_books') || '[]') as string[];
}

export function removeBookFile(title: string): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  const books = getBooks();
  const index = books.indexOf(title);

  if (index !== -1) {
    books.splice(index, 1);
    localStorage.setItem('read_fast_books', JSON.stringify(books));
    localStorage.removeItem(`read_fast_book:${title}`);
    localStorage.removeItem(`read_fast_position:${title}`);
  }
}

/**
 * Save the book to localstorage if necessary.
 *
 * @param {File} epub
 * @param {string} title
 * @returns {void}
 */
export function saveBook(epub: File, title: string): void {
  const reader = new FileReader();
  reader.onload = function (event: ProgressEvent<FileReader>) {
    const books = getBooks();
    books.push(title);

    if (event.target?.result) {
      localStorage.setItem('read_fast_books', JSON.stringify(books));
      localStorage.setItem(`read_fast_book:${title}`, event.target.result.toString());
    }
  };

  reader.readAsDataURL(epub);
}

/**
 * Return the base64-encoded string of the saved epub file.
 *
 * @param {string} title
 * @returns {string}
 */
export function loadBookFile(title: string): string | null {
  return localStorage.getItem(`read_fast_book:${title}`);
}
