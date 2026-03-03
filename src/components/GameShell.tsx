import { useMemo, useReducer } from 'react';
import { createInitialGameState, reduceGameState } from '../domain/gameState';
import type { GridCell, LevelDefinition } from '../domain/types';
import { useGridSelection } from '../hooks/useGridSelection';
import { FxLayer } from './FxLayer';
import { GridCanvas } from './GridCanvas';
import { ProgressPanel } from './ProgressPanel';
import { VideoOverlay } from './VideoOverlay';

type GameShellProps = {
  level: LevelDefinition;
};

const toLetterGrid = (rows: string[]): string[][] => rows.map((row) => row.split(''));

export function GameShell({ level }: GameShellProps) {
  const [state, dispatch] = useReducer(reduceGameState, level, createInitialGameState);

  const foundPaths = useMemo(
    () => level.words.filter((word) => state.foundWordIds.has(word.id)).map((word) => word.path),
    [level.words, state.foundWordIds]
  );

  const activeVideoWord = useMemo(
    () => level.words.find((word) => word.id === state.activeVideoWordId) ?? null,
    [level.words, state.activeVideoWordId]
  );

  const { activeSelection, onMouseStart, onMouseMove, onMouseEnd } = useGridSelection({
    gridSize: level.gridSize,
    canvasSize: 640,
    onSelectionCommitted: (path: GridCell[]) => {
      dispatch({ type: 'selection_committed', path });
    }
  });

  const isVideoOpen = state.phase === 'video_open' && activeVideoWord !== null;

  return (
    <main className="game-shell">
      <header className="game-header">
        <h1>{level.title}</h1>
      </header>

      <div className="game-main">
        <GridCanvas
          gridLetters={toLetterGrid(level.grid)}
          activeSelection={activeSelection}
          foundPaths={foundPaths}
          onMouseStart={onMouseStart}
          onMouseMove={onMouseMove}
          onMouseEnd={onMouseEnd}
          isInputBlocked={isVideoOpen}
        />
        <ProgressPanel foundCount={state.foundWordIds.size} totalCount={level.words.length} />
      </div>

      {isVideoOpen && activeVideoWord && (
        <VideoOverlay word={activeVideoWord} onClose={() => dispatch({ type: 'video_closed' })} />
      )}

      <FxLayer />
    </main>
  );
}
