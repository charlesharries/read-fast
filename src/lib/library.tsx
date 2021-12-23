import { useState, useContext, createContext } from 'preact/compat';
import { ComponentChildren, JSX } from 'preact';
import { getBooks } from './storage';

// LibraryContext represents the library context that's returned from
// our useLibrary hook.
type LibraryContext = {
  books: string[];
  addToLibrary: (book: string) => void;
  removeFromLibrary: (book: string) => void;
};

/**
 * Provide a book and a set of options for handling
 * uploading and reading books.
 *
 * @returns {LibraryContext}
 */
function useProvideLibrary(): LibraryContext {
  const [books, setBooks] = useState<string[]>(getBooks());

  function addToLibrary(title: string) {
    const newBooks = new Set([...books, title]);
    setBooks(Array.from(newBooks));
  }

  function removeFromLibrary(title: string) {
    const newBooks = new Set(books.filter((book) => book !== title));
    setBooks(Array.from(newBooks));
  }

  return { books, addToLibrary, removeFromLibrary };
}

// LibraryProviderProps is just a type for the children that get passed
// in.
type LibraryProviderProps = {
  children: ComponentChildren;
};

// Instantiate a default 'empty' context.
const libraryContext = createContext<LibraryContext>({
  books: [],
  addToLibrary: () => null,
  removeFromLibrary: () => null,
});

export function LibraryProvider({ children }: LibraryProviderProps): JSX.Element {
  const libraryProvider = useProvideLibrary();

  return <libraryContext.Provider value={libraryProvider}>{children}</libraryContext.Provider>;
}

export const useLibrary = (): LibraryContext => useContext(libraryContext);
