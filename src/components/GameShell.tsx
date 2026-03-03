import { useMemo, useReducer } from 'react';
import { createInitialGameState, reduceGameState } from '../domain/gameState';
import type { GridCell, LevelDefinition } from '../domain/types';
import { useGridSelection } from '../hooks/useGridSelection';
import { useBootSequence } from '../hooks/useBootSequence';
import { FxLayer } from './FxLayer';
import { GridCanvas } from './GridCanvas';
import { ProgressPanel } from './ProgressPanel';
import { MonitorFrame } from './scene/MonitorFrame';
import { SceneStage } from './scene/SceneStage';
import { ScreenViewport } from './scene/ScreenViewport';
import { BootOverlay } from './terminal/BootOverlay';
import { VideoOverlay } from './VideoOverlay';

type GameShellProps = {
  level: LevelDefinition;
  enableBootSequence?: boolean;
  bootDurationMs?: number;
};

const toLetterGrid = (rows: string[]): string[][] => rows.map((row) => row.split(''));
const bootLines = ['BOOTING CRT SHELL...', 'CALIBRATING PHOSPHOR GRID...', 'READY.'];

export function GameShell({ level, enableBootSequence = !import.meta.env.TEST, bootDurationMs = 1800 }: GameShellProps) {
  const [state, dispatch] = useReducer(reduceGameState, level, createInitialGameState);
  const boot = useBootSequence({
    enabled: enableBootSequence,
    durationMs: bootDurationMs,
    lineIntervalMs: 350,
    lines: bootLines
  });

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
  const isCompleted = state.phase === 'completed';
  const isBooting = boot.phase === 'booting';

  return (
    <main className="game-shell">
      <SceneStage>
        <MonitorFrame>
          <ScreenViewport>
            <header className="game-header">
              <h1>{level.title}</h1>
            </header>

            {isCompleted && (
              <section className="completion-banner" data-testid="completion-banner">
                <h2>All words found</h2>
                <p>Session complete.</p>
              </section>
            )}

            <div className="game-main">
              <GridCanvas
                gridLetters={toLetterGrid(level.grid)}
                activeSelection={activeSelection}
                foundPaths={foundPaths}
                onMouseStart={onMouseStart}
                onMouseMove={onMouseMove}
                onMouseEnd={onMouseEnd}
                isInputBlocked={isVideoOpen || isBooting}
                isBooting={isBooting}
              />
              <ProgressPanel foundCount={state.foundWordIds.size} totalCount={level.words.length} />
            </div>

            {isBooting && <BootOverlay lines={boot.visibleLines} visibleLineCount={boot.visibleLineCount} />}
          </ScreenViewport>
        </MonitorFrame>
      </SceneStage>

      {isVideoOpen && activeVideoWord && (
        <VideoOverlay word={activeVideoWord} onClose={() => dispatch({ type: 'video_closed' })} />
      )}

      <FxLayer />
    </main>
  );
}
