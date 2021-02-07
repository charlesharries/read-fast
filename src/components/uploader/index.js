import {useRef} from 'preact/hooks';
import Button from '../button';
import ePub from 'epubjs';
import { useBook } from '../../lib/book';

export default function Uploader() {
  const uploader = useRef(null);
  const { handleBook } = useBook()

  function handleSubmit(e) {
    e.preventDefault();

    try {
      const epub = ePub(uploader.current.files[0]);

      handleBook(epub);
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" id="book" name="book" ref={uploader} />

      <Button type="submit">Upload</Button>
    </form>
  )
}