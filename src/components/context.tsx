/* eslint-disable react/no-danger */
import { useEffect, useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { usePlayerController, wordsify } from '../hooks/usePlayer';

const toKey = (pi: number, wi: number) => `${pi}.${wi}`;

type ChapterMap = {
  [key: string]: number;
};

/**
 * Map out an array of array of strings into an index of
 * paragraphs and words that we can use to determine which
 * word is active.
 *
 * @param   {string[][]} paragraphs
 * @returns {ChapterMap} - E.g. { 0.0: 1, 0.1: 2, 1.0: 3 ... }
 */
function chapterMap(paragraphs: string[][]): ChapterMap {
  const reduceParagraphs = (pIndex: number, lengthSoFar: number) => (
    words: ChapterMap,
    word: string,
    wIndex: number
  ) => {
    words[toKey(pIndex, wIndex)] = wIndex + lengthSoFar;

    return words;
  };

  return paragraphs.reduce((words, paragraph, pIndex) => {
    const lengthSoFar = Object.keys(words).length;

    return { ...words, ...paragraph.reduce(reduceParagraphs(pIndex, lengthSoFar), {}) };
  }, {});
}

type ContextProps = {
  content: string;
};

type ParagraphProps = {
  paraIndex: number;
  words: string[];
};

/**
 *
 * @param   {Object} props
 * @returns {React.Component}
 */
function Context({ content }: ContextProps): JSX.Element {
  const paras = wordsify(content);
  const $context = useRef<HTMLDivElement>(null);
  const { index, setIndex } = usePlayerController();

  const keys = chapterMap(paras);

  // Scroll to the active word (if any).
  useEffect(() => {
    const $active = $context.current ? $context.current.querySelector('.active') : null;

    if ($active) {
      $active.scrollIntoView();
    }
  }, [content]);

  /* eslint-disable */
  function Paragraph({ paraIndex, words }: ParagraphProps) {
    return (
      <p
        onClick={() => setIndex(keys[toKey(paraIndex, 0)])}
        dangerouslySetInnerHTML={{
          __html: words
            .map((w, wordIndex) => {
              if (keys[toKey(paraIndex, wordIndex)] === index) {
                return `<span class="active">${w}</span>`;
              }

              return w;
            })
            .join(' '),
        }}
      />
    );
  }

  return (
    <div className="context prose p-md" ref={$context}>
      {paras.map((p, paraIndex) => (
        <Paragraph paraIndex={paraIndex} words={p} />
      ))}
    </div>
  );
}

export default Context;
