import {useBook} from '../../lib/book';
import { useState, useEffect, useRef } from 'preact/compat';
import { NavItem } from 'epubjs';
import Player from '../player';

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
  const [content, setContent] = useState('');

  useEffect(() => {
    if (book && chapter) {
      book.load(chapter.href).then(doc => {
        setContent(doc.body.textContent);
      })
    }
  }, [chapter, book])

  return { content }
}

export default function Content() {
  const { book, chapter } = useBook()
  const { content } = useContent(chapter);
  
  if (!book) return <p>Load a book...</p>;

  return <Player content={content} />
}