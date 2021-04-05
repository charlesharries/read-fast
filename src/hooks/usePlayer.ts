import { useState, useRef, useEffect, createContext, useContext } from 'preact/compat';
import { useBook, getTitle, currentPosition } from '../lib/book';

const defaultWpm = 500;

type WordTypeOptions = {
  avg: number;
  length: number;
  wpm: number;
};

/**
 * Calculate the amount of time that a word ought to stay on
 * the screen, given its length, in milliseconds.
 *
 * @param  {WordTypeOptions} options
 * @return {number}
 */
const calculateWordTime = ({ length, avg, wpm }: WordTypeOptions): number => {
  const secondsPerLetter = 60 / (wpm * avg);
  const adjustment = (avg - length) * 0.01;

  return (length * secondsPerLetter + adjustment) * 1000;
};

// WordLengthCache is how we determine how long to show a word of
// length `key` for.
type WordLengthCache = {
  [key: number]: number;
};

/**
 * Memoize the `wordTime` function so we don't need to do a bunch
 * of math every time we need the word time for a certain length.
 *
 * @param   {number} avg - Average words per minute.
 * @returns {(number) => number}
 */
function memoizedWordTime(avg: number, wpm: number): (length: number) => number {
  const cache: WordLengthCache = {};

  return (length) => {
    if (length in cache) {
      return cache[length];
    }

    const result = calculateWordTime({ avg, length, wpm });
    cache[length] = result;
    return result;
  };
}

/**
 * Split content into paragraph arrays of arrays of words.
 *
 * @param content Content to split into words.
 * @returns {string[][]}
 */
export function wordsify(content: string): string[][] {
  return content.split(/[\r\n]+/).map((p) => p.split(/\s+/).filter((w) => !!w));
}

// BookContext represents the book context that's returned from our
// useBook hook.
type PlayerContext = {
  index: number;
  wpm: number;
  setIndex: (i: number) => void;
  setWpm: (i: number) => void;
};

export const playerContext = createContext<PlayerContext>({
  index: 0,
  wpm: defaultWpm,
  setIndex: () => null,
  setWpm: () => null,
});

export const usePlayerController = (): PlayerContext => useContext(playerContext);

// Player is the type that gets returned from our usePlayer hook.
type Player = PlayerContext & {
  play: () => void;
  pause: () => void;
  words: string[];
  isPlaying: boolean;
};

/**
 * Get the data we need to run the book player.
 *
 * @param {string} content
 * @returns {Player}
 */
export default function usePlayer(content: string): Player {
  const { chapter, book } = useBook();

  const position = useRef(currentPosition(book));
  let initialIndex = 0;
  if (position.current && position.current.chapter.id === chapter.id) {
    initialIndex = position.current.index;
  }

  const indexRef = useRef(initialIndex);
  const previousTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const animationFrame = useRef<number>();
  const saveInterval = useRef<NodeJS.Timeout>(null);
  const [index, setIndex] = useState(indexRef.current);
  const [isPlaying, setIsPlaying] = useState(isPlayingRef.current);
  const [wpm, setWpm] = useState(defaultWpm);

  const paras = wordsify(content);
  const words = paras.reduce((a, p) => [...a, ...p]);

  const hasPositionForThisChapter = position.current && position.current.chapter.id === chapter.id;
  const avgWord = words.reduce((s, w) => s + w.length, 0) / words.length;
  const wordTime = useRef(memoizedWordTime(avgWord, wpm));

  useEffect(() => {
    wordTime.current = memoizedWordTime(avgWord, wpm);
  }, [wpm, avgWord]);

  function savePosition() {
    const pos = `${chapter.id}:${indexRef.current}`;
    const title = getTitle(book);

    localStorage.setItem(`read_fast_position:${title}`, pos);
  }

  function setWordTo(i: number) {
    indexRef.current = i;
    setIndex(i);
  }

  /**
   * Handle a single frame of animation.
   *
   * @param {number} time - Current timestamp in milliseconds
   */
  function tick(time: number) {
    if (!isPlayingRef.current) return;

    // The time elapsed since the last word was changed.
    const delta = time - previousTimeRef.current;

    // If the amount of time elapsed since the last word is _greater_ than
    // the amount of time that we should display the current word, then
    // switch to the next word.
    if (delta > wordTime.current(words[indexRef.current]?.length)) {
      setIndex((i) => {
        indexRef.current = i + 1;
        return indexRef.current;
      });
      previousTimeRef.current = time;
    }

    animationFrame.current = requestAnimationFrame(tick);
  }

  // When we change chapters, we want to reset our index.
  useEffect(() => {
    setWordTo(hasPositionForThisChapter ? position.current.index : 0);
  }, [content.length, hasPositionForThisChapter]);

  // Handle playing/pausing.
  useEffect(() => {
    isPlayingRef.current = isPlaying;

    if (isPlayingRef.current) {
      requestAnimationFrame(tick);
      saveInterval.current = setInterval(savePosition, 1500);
    } else {
      cancelAnimationFrame(animationFrame.current);
      clearInterval(saveInterval.current);
    }

    return () => cancelAnimationFrame(animationFrame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    index,
    wpm,
    setIndex: setWordTo,
    setWpm,
    words,
    isPlaying,
  };
}
