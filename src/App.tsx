import level01 from '../content/levels/level-01.json';
import { loadLevel } from './domain/loadLevel';
import { GameShell } from './components/GameShell';

function App() {
  const level = loadLevel(level01);

  return <GameShell level={level} enableBootSequence />;
}

export default App;
