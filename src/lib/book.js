import { useState, useContext, createContext } from 'preact/compat';
import ePub, { Book } from 'epubjs';

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
  const handleBook = async (book) => {
    await book.opened;

    setBook(book);
    setChapter(book.navigation.toc[0]);
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
