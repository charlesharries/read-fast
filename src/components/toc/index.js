import { useBook } from '../../lib/book';

export default function TableOfContents() {
  const { book } = useBook();
  
  if (!book) return null;

  return (
    <ul className="Chapters">
      {book.navigation.toc.map(chapter => {
        return <li>{chapter.label}</li>
      })}
    </ul>
  )
}