import { useState, useContext, createContext, StateUpdater } from 'preact/compat';
import { Book, NavItem } from 'epubjs';
import { ComponentChildren, JSX } from 'preact';

const emptyNavItem: NavItem = {
  id: '',
  href: '',
  label: '',
};

// Position is a parsed representation of a position saved in a book,
// which we save to localStorage.
type Position = {
  chapter: NavItem;
  index: number;
};

// BookContext represents the book context that's returned from our
// useBook hook.
type BookContext = {
  book: Book | null;
  chapter: NavItem;
  setChapter: StateUpdater<NavItem>;
  handleBook: (bk: Book | null) => Promise<void>;
};

/**
 * Get the title of the given book.
 *
 * @param {Book} book
 * @returns {string}
 */
export function getTitle(book: Book): string {
  if (!book?.packaging?.metadata) return '';

  return book.packaging.metadata.title;
}

/**
 * Recursively get all chapters within the given NavItems.
 *
 * @param {NavItem[]} navItems
 * @returns {NavItem[]}
 */
function allNavItems(navItems: NavItem[]): NavItem[] {
  const withSubItems = (all: NavItem[], item: NavItem) => [...all, item, ...(item.subitems || [])];

  return navItems.reduce(withSubItems, []);
}

/**
 * Gets the current position in the given book, or null.
 *
 * @param {Book} book
 * @returns {Position | null}
 */
export function currentPosition(book: Book): Position | null {
  if (!(localStorage && book)) return null;

  const pos = localStorage.getItem(`read_fast_position:${getTitle(book)}`);

  if (!pos) {
    return null;
  }

  const [chapId, index] = pos.split(':');

  const chapter = allNavItems(book.navigation.toc).find((chap) => chap.id === chapId);

  if (chapter) {
    return { chapter, index: parseInt(index, 10) };
  }

  return null;
}

/**
 * Provide a book and a set of options for handling
 * uploading and reading books.
 *
 * @returns {BookContext}
 */
function useProvideBook(): BookContext {
  const [book, setBook] = useState<Book | null>(null);
  const [chapter, setChapter] = useState<NavItem>(emptyNavItem);

  /**
   * Handle receiving an epub and load it into context
   * once the book has been opened.
   *
   * @param   {Book} book
   * @returns {Promise<void>}
   */
  const handleBook = async (bk: Book | null) => {
    if (!bk) {
      setBook(bk);
      return;
    }

    await bk.opened;
    setBook(bk);

    const position = currentPosition(bk);
    setChapter(position ? position.chapter : bk.navigation.toc[0]);
  };

  return { book, chapter, setChapter, handleBook };
}

// BookProviderProps is just a type for the children that get passed
// in.
type BookProviderProps = {
  children: ComponentChildren;
};

// Instantiate a default 'empty' context.
const bookContext = createContext<BookContext>({
  book: null!,
  chapter: emptyNavItem,
  setChapter: () => null,
  handleBook: () => new Promise((resolve) => resolve()),
});

export function BookProvider({ children }: BookProviderProps): JSX.Element {
  const bookProvider = useProvideBook();

  return <bookContext.Provider value={bookProvider}>{children}</bookContext.Provider>;
}

export const useBook = (): BookContext => useContext(bookContext);
