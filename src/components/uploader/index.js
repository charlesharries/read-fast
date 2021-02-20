import { useRef } from 'preact/hooks';
import ePub from 'epubjs';
import Button from '../button';
import { useBook } from '../../lib/book';
import { saveBook } from '../../lib/storage';

export default function Uploader() {
  const uploader = useRef(null);
  const { handleBook } = useBook();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const file = uploader.current.files[0];
      const book = ePub(file);

      await handleBook(book);

      // Save the book to localstorage
      saveBook(file, book.packaging.metadata.title);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" id="book" name="book" ref={uploader} />

      <Button type="submit">Upload</Button>
    </form>
  );
}
