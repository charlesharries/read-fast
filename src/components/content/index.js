import {useBook} from '../../lib/book';
import { useEffect, useRef } from 'preact/compat';
import { NavItem } from 'epubjs';

/**
 * Remove all children (including text nodes) of
 * a given HTMLElement.
 * 
 * @param {HTMLElement} $el 
 */
function removeChildren($el) {
  while ($el.firstChild) {
    $el.removeChild($el.lastChild);
  }
}

/**
 * Load the content for the given chapter.
 * 
 * @param {NavItem} chapter 
 */
function useContent(chapter) {
  const { book } = useBook();
  const container = useRef();

  useEffect(() => {
    if (book && chapter) {
      book.load(chapter.href).then(doc => {
        removeChildren(container.current);
        container.current.appendChild(doc.body);
      })
    }
  }, [chapter, book])

  return { container }
}

export default function Content() {
  const { book, chapter } = useBook()
  const { container } = useContent(chapter);
  
  if (!book) return <p>Load a book...</p>;

  return <div className="Content" ref={container} />
}