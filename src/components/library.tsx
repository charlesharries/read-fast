import ePub from 'epubjs';
import { JSX } from 'preact/jsx-runtime';
import { useBook } from '../lib/book';
import { getBooks, loadBookFile } from '../lib/storage';

export default function Library(): JSX.Element {
  const books = getBooks();

  const { handleBook } = useBook();

  async function loadBook(title: string) {
    const file = loadBookFile(title);
    if (!file) {
      return;
    }

    const book = ePub(file, { encoding: 'base64' });
    const b64 = file.replace('data:application/epub+zip;base64,', '');

    await book.open(b64);
    await handleBook(book);
  }

  return (
    <div className="library p-md stack stack--md">
      <h4>Your library</h4>
      <ul className="library__list list stack" role="list">
        {books.map((title) => (
          <li>
            <button
              type="button"
              className="library__item text-left"
              onClick={() => loadBook(title)}
            >
              {title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
