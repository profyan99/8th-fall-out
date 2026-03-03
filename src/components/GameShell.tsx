import type { LevelDefinition } from '../domain/types';
import { FxLayer } from './FxLayer';
import { GridCanvas } from './GridCanvas';
import { ProgressPanel } from './ProgressPanel';

type GameShellProps = {
  level: LevelDefinition;
};

const toLetterGrid = (rows: string[]): string[][] => rows.map((row) => row.split(''));

export function GameShell({ level }: GameShellProps) {
  return (
    <main className="game-shell">
      <header className="game-header">
        <h1>{level.title}</h1>
      </header>

      <div className="game-main">
        <GridCanvas
          gridLetters={toLetterGrid(level.grid)}
          activeSelection={[]}
          foundPaths={[]}
          onPointerStart={() => undefined}
          onPointerMove={() => undefined}
          onPointerEnd={() => undefined}
        />
        <ProgressPanel foundCount={0} totalCount={level.words.length} />
      </div>

      <FxLayer />
    </main>
  );
}
