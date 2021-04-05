import { NavItem } from 'epubjs';
import { JSX } from 'preact/jsx-runtime';
import { useBook } from '../lib/book';

type ChapterProps = {
  setChapter: (chapter: NavItem) => void;
  chapter: NavItem;
};

function Chapter({ setChapter, chapter }: ChapterProps) {
  return (
    <button type="button" className="text-left" onClick={() => setChapter(chapter)}>
      {chapter.label}
    </button>
  );
}

export default function TableOfContents(): JSX.Element | null {
  const { book, setChapter } = useBook();

  if (!book?.packaging?.metadata) return null;

  return (
    <div className="toc stack stack--md p-md">
      <h4>{book.packaging.metadata.title}</h4>
      <ul className="list font-sm stack">
        {book.navigation.toc.map((chapter) => (
          <li className="stack">
            <Chapter chapter={chapter} setChapter={setChapter} />

            {chapter.subitems?.length ? (
              <ul className="list stack">
                {chapter.subitems.map((item) => (
                  <li className="list__item">
                    <Chapter chapter={item} setChapter={setChapter} />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
