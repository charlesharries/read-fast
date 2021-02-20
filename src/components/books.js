import ePub from 'epubjs';
import Button from './button';
import { useBook } from '../lib/book';
import { getBooks, loadBookFile } from '../lib/storage';

export default function Books() {
  const books = getBooks();

  const { handleBook } = useBook();

  function loadBook(title) {
    const file = loadBookFile(title);

    const book = ePub(file, { encoding: 'base64' });
    const b64 = file.replace('data:application/epub+zip;base64,', '');
    book.open(b64);

    console.log({ book });

    handleBook(book);
  }

  return (
    <ul>
      {books.map((title) => (
        <li>
          <Button onClick={() => loadBook(title)}>{title}</Button>
        </li>
      ))}
    </ul>
  );
}
