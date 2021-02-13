import PropTypes from 'prop-types';
import usePlayer from '../../hooks/usePlayer';

export default function Player({ content = '' }) {
  const { words, index, play, pause, isPlaying } = usePlayer(content);

  if (!words.length) return <p>chapter is empty</p>;

  function toggle() {
    return isPlaying ? pause() : play();
  }

  return (
    <div className="Player">
      <p style={{ fontSize: '64px', textAlign: 'center' }}>{words[index]}</p>
      <button type="button" onClick={toggle}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}

Player.propTypes = {
  content: PropTypes.string,
};
