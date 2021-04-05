import { useRef } from 'preact/hooks';
import ePub from 'epubjs';
import { JSX } from 'preact/jsx-runtime';
import { useBook } from '../lib/book';
import { saveBook } from '../lib/storage';

export default function Uploader(): JSX.Element {
  const uploader = useRef<HTMLInputElement>(null);
  const { handleBook } = useBook();

  function handleKey(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      uploader.current.click();
    }
  }

  async function upload(e: Event) {
    e.preventDefault();

    try {
      const file = uploader.current.files?.[0];
      if (!file) {
        return;
      }

      // Casting to any because the type definition hasn't bee updated
      // on the live site.
      // @todo: Remove this cast.
      const book = ePub((await file.arrayBuffer()) as any);

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
          tabIndex={0}
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
