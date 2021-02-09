import { useState, useEffect, useRef } from 'preact/compat';

const wordTime = length => {
  const wordsPerMinute = 400;
  const averageWordLength = 4.65;
  const secondsPerLetter = 60 / (wordsPerMinute * averageWordLength);
  const adjustment = (4.65 - length) * 0.02;

  return (length * secondsPerLetter + adjustment) * 1000;
}

export default function Player({ content = '' }) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const previousTimeRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);

  const words = content.split(/\s+/).filter(w => !!w);

  const requestRef = useRef();

  const updateWord = time => {
    if (!isPlayingRef.current) return;

    if (previousTimeRef.current == undefined) {
      previousTimeRef.current = time;
    }

    const currentWord = words[indexRef.current];
    const delta = time - previousTimeRef.current;

    if (delta > wordTime(currentWord?.length || 1)) {
      setIndex(i => {
        indexRef.current = i + 1
        return indexRef.current;
      });
      previousTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(updateWord);
  }

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateWord)
    } else {
      cancelAnimationFrame(updateWord)
    }

    isPlayingRef.current = isPlaying;

    return () => cancelAnimationFrame(updateWord);
  }, [isPlaying])

  if (!words.length) return <p>chapter is empty</p>

  function toggle() {
    setIsPlaying(!isPlaying);
  }

  return (
    <div className="Player">
      <p style={{ fontSize: '64px', textAlign: 'center' }}>{words[index]}</p>
      <button type="button" onClick={toggle}>{isPlaying ? 'Pause' : 'Play'}</button>
    </div>
  )
}