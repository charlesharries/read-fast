import ePub from 'epubjs';
import { JSX } from 'preact/jsx-runtime';
import { useBook } from '../lib/book';
import { loadBookFile, removeBookFile } from '../lib/storage';
import { useLibrary } from '../lib/library';

export default function Library(): JSX.Element {
  const { books, removeFromLibrary } = useLibrary();
  const { handleBook } = useBook();

  function removeBook(title: string) {
    removeFromLibrary(title);
    removeBookFile(title);
  }

  async function loadBook(title: string) {
    const file = loadBookFile(title);
    if (!file) {
      return;
    }

    const book = ePub(file, { encoding: 'base64' });
    const b64 = file.replace('data:application/epub+zip;base64,', '');

    await book.open(b64);
    await handleBook(book);
    console.log({ book });
  }

  return (
    <div className="library p-md stack stack--md">
      <h4>Your library</h4>
      <ul className="library__list list stack" role="list">
        {books.map((title) => (
          <li className="d-flex justify-between">
            <button
              type="button"
              className="library__item text-left"
              onClick={() => loadBook(title)}
            >
              {title}
            </button>
            <button type="button" onClick={() => removeBook(title)}>
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
