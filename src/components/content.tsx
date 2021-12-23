import { useState, useEffect, JSX } from 'preact/compat';
import { NavItem } from 'epubjs';
import { useBook } from '../lib/book';
import Player from './player';
import About from './about';

/**
 * Load the content for the given chapter.
 *
 * @param {NavItem} chapter
 */
function useContent(chapter: NavItem) {
  const { book } = useBook();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (book && chapter?.href) {
      const [url] = chapter.href.split(/[#?]/);
      console.log({ chapter, url });

      book
        .load(url)
        .then((doc) => {
          const document = doc as HTMLDocument;
          setContent(document.body.textContent || '');
        })
        .catch((err) => console.error(err));
    }
  }, [chapter, book]);

  return { content };
}

export default function Content(): JSX.Element {
  const { book, chapter } = useBook();
  const { content } = useContent(chapter);

  if (!book?.packaging?.metadata) return <About />;

  return <Player content={content} />;
}
