import { JSX } from 'preact/jsx-runtime';
import { usePlayerController } from '../hooks/usePlayer';

function SpeedSelector(): JSX.Element {
  const { wpm, setWpm } = usePlayerController();
  const speeds = Array.from({ length: 10 }, (_, i) => i + 1);

  function handleChange(event: Event) {
    const newWpm = parseInt((event.target as HTMLSelectElement).value, 10);
    setWpm(newWpm);
  }

  return (
    <select value={wpm} onChange={handleChange}>
      {speeds.map((speed) => (
        <option value={speed * 100}>{speed * 100}</option>
      ))}
    </select>
  );
}

export default SpeedSelector;
