import { GameShell } from './components/GameShell';
import { LevelFatalScreen } from './components/LevelFatalScreen';
import { loadLevel } from './domain/loadLevel';
import { availableLevels, resolveLevelPayload } from './domain/levelCatalog';

function App() {
  const resolveResult = resolveLevelPayload(window.location.search);
  const search = new URLSearchParams(window.location.search);
  const isVisualMode = search.get('visual') === '1';

  if (resolveResult.status === 'error') {
    return (
      <LevelFatalScreen
        reason={resolveResult.reason}
        requestedLevel={resolveResult.requestedLevel}
        availableLevels={availableLevels}
      />
    );
  }

  const level = loadLevel(resolveResult.payload);

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
