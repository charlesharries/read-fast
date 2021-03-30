import { useState, useContext, createContext } from 'preact/compat';
import ePub, { Book } from 'epubjs';

/**
 *
 * @param   {Book} book
 * @returns {string}
 */
export function getTitle(book) {
  return book.packaging.metadata.title;
}

export function currentPosition(book) {
  if (!localStorage) return null;

  if (localStorage.getItem(`read_fast_position:${getTitle(book)}`)) {
    const [chapId, index] = localStorage.getItem(`read_fast_position:${getTitle(book)}`).split(':');

    const chapter = book.navigation.toc.find((chap) => chap.id === chapId);

    return { chapter, index: parseInt(index, 10) };
  }

  return null;
}

/**
 * Provide a book and a set of options for handling
 * uploading and reading books.
 *
 * @returns {{ book: Book, handleBook: Function }}
 */
function useProvideBook() {
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);

  /**
   * Handle receiving an epub and load it into context
   * once the book has been opened.
   *
   * @param   {any} book
   * @returns {void}
   */
  const handleBook = async (bk) => {
    await bk.opened;

    setBook(bk);

    const position = currentPosition(bk);
    setChapter(position ? position.chapter : bk.navigation.toc[0]);
  };

  return { book, chapter, setChapter, handleBook };
}

const bookContext = createContext();

export function BookProvider({ children }) {
  const bookProvider = useProvideBook();

  return <bookContext.Provider value={bookProvider}>{children}</bookContext.Provider>;
}

/**
 * @returns {{ book: Book, handleBook: Function }}
 */
export const useBook = () => useContext(bookContext);
