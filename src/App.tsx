import level01 from '../content/levels/level-01.json';
import { loadLevel } from './domain/loadLevel';
import { GameShell } from './components/GameShell';

function App() {
  const level = loadLevel(level01);
  const search = new URLSearchParams(window.location.search);
  const isVisualMode = search.get('visual') === '1';

  return (
    <GameShell
      level={level}
      enableBootSequence
      bootDurationMs={isVisualMode ? 2600 : 1800}
      bootLineIntervalMs={isVisualMode ? 20_000 : 350}
    />
  );
}

export default App;
