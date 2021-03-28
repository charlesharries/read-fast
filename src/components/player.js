import PropTypes from 'prop-types';
import usePlayer from '../hooks/usePlayer';
import Context from './context';

export default function Player({ content = '' }) {
  const { words, index, setIndex, play, pause, isPlaying } = usePlayer(content);

  if (!words.length) return <p>chapter is empty</p>;

  function toggle() {
    return isPlaying ? pause() : play();
  }

  return (
    <div className="player">
      <div className="player__content p-md">
        <p style={{ fontSize: '64px', textAlign: 'center' }}>{words[index]}</p>
        <button type="button" onClick={toggle}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>

      <div className="player__context">
        <Context index={index} setIndex={setIndex} content={content} />
      </div>
    </div>
  );
}

Player.propTypes = {
  content: PropTypes.string,
};
