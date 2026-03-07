import { useMemo, useReducer } from 'react';
import { createInitialGameState, reduceGameState } from '../domain/gameState';
import type { GridCell, LevelDefinition } from '../domain/types';
import { useGridSelection } from '../hooks/useGridSelection';
import { useParallax } from '../hooks/useParallax';
import { useBootSequence } from '../hooks/useBootSequence';
import { FxLayer } from './FxLayer';
import { GridCanvas } from './GridCanvas';
import { ProgressPanel } from './ProgressPanel';
import { MonitorFrame } from './scene/MonitorFrame';
import { ParallaxBackdrop } from './scene/ParallaxBackdrop';
import { SceneStage } from './scene/SceneStage';
import { ScreenViewport } from './scene/ScreenViewport';
import { BootOverlay } from './terminal/BootOverlay';
import { TerminalHud } from './terminal/TerminalHud';
import { VideoOverlay } from './VideoOverlay';

type GameShellProps = {
  level: LevelDefinition;
  enableBootSequence?: boolean;
  bootDurationMs?: number;
  bootLineIntervalMs?: number;
};

const toLetterGrid = (rows: string[]): string[][] => rows.map((row) => row.split(''));
const bootLines = ['BOOTING CRT SHELL...', 'CALIBRATING PHOSPHOR GRID...', 'READY.'];
const GRID_CANVAS_SIZE = 700;

export function GameShell({
  level,
  enableBootSequence = false,
  bootDurationMs = 1800,
  bootLineIntervalMs = 350
}: GameShellProps) {
  const [state, dispatch] = useReducer(reduceGameState, level, createInitialGameState);
  const boot = useBootSequence({
    enabled: enableBootSequence,
    durationMs: bootDurationMs,
    lineIntervalMs: bootLineIntervalMs,
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
    canvasSize: GRID_CANVAS_SIZE,
    onSelectionCommitted: (path: GridCell[]) => {
      dispatch({ type: 'selection_committed', path });
    }
  });
  const { layerTransforms, onPointerMove, onPointerLeave } = useParallax('medium');

  const isVideoOpen = state.phase === 'video_open' && activeVideoWord !== null;
  const isCompleted = state.phase === 'completed';
  const isBooting = boot.phase === 'booting';

  return (
    <main className="game-shell">
      <ParallaxBackdrop
        layerTransforms={layerTransforms}
        className="parallax-backdrop parallax-backdrop-global"
        testId="global-parallax-backdrop"
      />
      <SceneStage onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <MonitorFrame>
          <ScreenViewport>
            <TerminalHud
              title={level.title}
              sessionId={level.id}
              foundCount={state.foundWordIds.size}
              totalCount={level.words.length}
            />

            {isCompleted && (
              <section className="completion-banner" data-testid="completion-banner">
                <h2>8 March transmission complete</h2>
                <p>Congratulations. Terminal session archived with gratitude.</p>
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
