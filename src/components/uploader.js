import { useRef } from 'preact/hooks';
import ePub from 'epubjs';
import { useBook } from '../lib/book';
import { saveBook } from '../lib/storage';

export default function Uploader() {
  const uploader = useRef(null);
  const { handleBook } = useBook();

  function handleKey(event) {
    if (event.which === 32 || event.which === 13) {
      event.preventDefault();
      uploader.current.click();
    }
  }

  async function upload(e) {
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
    <form className="uploader p-md">
      <label htmlFor="book" className="uploader__label w-100">
        <span
          role="button"
          aria-controls="book"
          tabIndex="0"
          onKeyPress={handleKey}
          onKeyUp={handleKey}
          className="button button--icon button--success"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add book
        </span>

        <input
          type="file"
          id="book"
          name="book"
          className="uploader__input"
          ref={uploader}
          onChange={upload}
          accept=".epub"
        />
      </label>
    </form>
  );
}
