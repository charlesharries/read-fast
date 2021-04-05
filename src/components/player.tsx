import { JSX } from 'preact';
import usePlayer, { playerContext } from '../hooks/usePlayer';
import Context from './context';
import SpeedSelector from './SpeedSelector';

// PlayerProps are the props provided to this component.
type PlayerProps = {
  content: string;
};

export default function Player({ content = '' }: PlayerProps): JSX.Element {
  const { words, index, setIndex, wpm, setWpm, play, pause, isPlaying } = usePlayer(content);

  if (!words.length) return <p>chapter is empty</p>;

  function toggle() {
    return isPlaying ? pause() : play();
  }

  return (
    <playerContext.Provider value={{ index, wpm, setIndex, setWpm }}>
      <div className="player">
        <div className="player__content p-md">
          <p style={{ fontSize: '64px', textAlign: 'center' }}>{words[index]}</p>
          <button type="button" onClick={toggle}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          {isPlaying ? null : <SpeedSelector />}
        </div>

        <div className="player__context">
          <Context content={content} />
        </div>
      </div>
    </playerContext.Provider>
  );
}
