/* eslint-disable react/no-danger */
import { useRef } from 'preact/hooks';
import { wordsify } from '../hooks/usePlayer';

function Context({ index, content }) {
  const paras = wordsify(content);
  const count = useRef(0);

  const chapterMap = paras.reduce((words, paragraph, paragraphIndex) => [
    ...words,
    ...paragraph.map((word, wordIndex) => `${paragraphIndex}:${wordIndex}`),
  ]);

  return (
    <div className="context prose p-md">
      {paras.map((p, paraIndex) => (
        <p
          dangerouslySetInnerHTML={{
            __html: p
              .map((w, wordIndex) => {
                if (chapterMap[index] === `${paraIndex}:${wordIndex}`) {
                  return `<span class="active">${w}</span>`;
                }

                return w;
              })
              .join(' '),
          }}
        />
      ))}
    </div>
  );
}

export default Context;
