import { useBook } from '../../lib/book';

export default function TableOfContents() {
  const { book, setChapter } = useBook();
  
  if (!book) return null;

  return (
    <ul className="Chapters">
      {book.navigation.toc.map(chapter => {
        return (
          <li>
            <button type="button" onClick={() => setChapter(chapter)}>
              {chapter.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}