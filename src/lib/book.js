import { useState, useContext, createContext } from 'preact/compat';
import { Book } from 'epubjs';

/**
 * Provide a book and a set of options for handling
 * uploading and reading books.
 * 
 * @returns {{ book: Book, handleBook: Function }}
 */
function useProvideBook() {
  const [book, setBook] = useState(null);

  /**
   * Handle receiving an epub and load it into context
   * once the book has been opened.
   * 
   * @param   {Book} book 
   * @returns {void}
   */
  const handleBook = async (book) => {
    await book.opened;
    setBook(book);
  }

  return { book, handleBook }
}

const bookContext = createContext()

export function BookProvider({ children }) {
  const bookProvider = useProvideBook();

  return <bookContext.Provider value={bookProvider}>{children}</bookContext.Provider>
}

export const useBook = () => useContext(bookContext);