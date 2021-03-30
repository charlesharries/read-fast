import { useState, useRef, useEffect } from 'preact/compat';
import { useBook, getTitle, currentPosition } from '../lib/book';

const wpm = 500;

/**
 * Calculate the amount of time that a word ought to stay on
 * the screen, given its length.
 *
 * @param   {Object} options - Options for calculating length.
 * @param   {number} options.wpm - Number of words per minute to read.
 * @param   {number} options.length - Length of the given word.
 * @param   {number} options.avgWord - Average word length.
 * @returns {number} - The time to display the word.
 */
const calculateWordTime = ({ length, avg }) => {
  const secondsPerLetter = 60 / (wpm * avg);
  const adjustment = (4.65 - length) * 0.01;

  return (length * secondsPerLetter + adjustment) * 1000;
};

/**
 * Memoize the `wordTime` function so we don't need to do a bunch
 * of math every time we need the word time for a certain length.
 *
 * @param   {number} avg - Average words per minute.
 * @returns {function(): number}
 */
function memoizedWordTime(avg) {
  const cache = {};

  return (len) => {
    if (len in cache) {
      return cache[len];
    }

    const result = calculateWordTime({ avg, length: len });
    cache[len] = result;
    return result;
  };
}

export function wordsify(content) {
  return content.split(/[\r\n]+/).map((p) => p.split(/\s+/).filter((w) => !!w));
}

export default function usePlayer(content) {
  const { chapter, book } = useBook();

  const position = useRef(currentPosition(book));
  let initialIndex = 0;
  if (position.current && position.current.chapter.id === chapter.id) {
    initialIndex = position.current.index;
  }

  const indexRef = useRef(initialIndex);
  const previousTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const requestRef = useRef();
  const saveInterval = useRef(null);
  const [index, setIndex] = useState(indexRef.current);
  const [isPlaying, setIsPlaying] = useState(isPlayingRef.current);

  const paras = wordsify(content);
  const words = paras.reduce((a, p) => [...a, ...p]);

  const hasPositionForThisChapter = position.current && position.current.chapter.id === chapter.id;

  /**
   * The average length of the words in the given content.
   *
   * @type {number}
   */
  const avgWord = words.reduce((s, w) => s + w.length, 0) / words.length;

  // Build the function for memoizing word times.
  const wordTime = memoizedWordTime(avgWord);

  function savePosition() {
    const position = `${chapter.id}:${indexRef.current}`;
    const title = getTitle(book);

    localStorage.setItem(`read_fast_position:${title}`, position);
  }

  /**
   * Handle a single frame of animation.
   *
   * @param {number} time - Current timestamp in milliseconds
   */
  function tick(time) {
    if (!isPlayingRef.current) return;

    // The time elapsed since the last word was changed.
    const delta = time - previousTimeRef.current;

    // If the amount of time elapsed since the last word is _greater_ than
    // the amount of time that we should display the current word, then
    // switch to the next word.
    if (delta > wordTime(words[indexRef.current]?.length)) {
      setIndex((i) => {
        indexRef.current = i + 1;
        return indexRef.current;
      });
      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(tick);
  }

  // When we change chapters, we want to reset our index.
  useEffect(() => {
    if (!hasPositionForThisChapter) {
      indexRef.current = 0;
      setIndex(0);
    } else {
      indexRef.current = position.current.index;
      setIndex(position.current.index);
    }
  }, [content.length, hasPositionForThisChapter]);

  // Handle playing/pausing.
  useEffect(() => {
    isPlayingRef.current = isPlaying;

    if (isPlayingRef.current) {
      requestRef.current = requestAnimationFrame(tick);

      saveInterval.current = setInterval(savePosition, 1500);
    } else {
      cancelAnimationFrame(tick);

      clearInterval(saveInterval.current);
    }

    return () => cancelAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    index,
    setIndex,
    words,
    isPlaying,
  };
}
