import { GameShell } from './components/GameShell';
import { loadLevel } from './domain/loadLevel';
import { resolveLevelPayload } from './domain/levelCatalog';

function App() {
  const level = loadLevel(resolveLevelPayload(window.location.search));
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
