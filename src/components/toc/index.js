import { useBook } from '../../lib/book';
import Button from '../button';

export default function TableOfContents() {
  const { book, setChapter } = useBook();

  if (!book) return null;

  return (
    <ul className="Chapters">
      {book.navigation.toc.map((chapter) => (
        <li>
          <Button class="button" onClick={() => setChapter(chapter)}>
            {chapter.label}
          </Button>

          {chapter.subitems?.length ? (
            <ul>
              {chapter.subitems.map((item) => (
                <li>
                  <Button class="button" onClick={() => setChapter(item)}>
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
