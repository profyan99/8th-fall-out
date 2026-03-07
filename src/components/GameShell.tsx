import { useMemo, useReducer } from 'react';
import { createInitialGameState, reduceGameState } from '../domain/gameState';
import type { GridCell, LevelDefinition } from '../domain/types';
import { ru } from '../i18n/ru';
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
const bootLines = ru.boot.lines;
const GRID_CANVAS_SIZE = 640;

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

  const activeMediaWord = useMemo(
    () => level.words.find((word) => word.id === state.activeVideoWordId) ?? null,
    [level.words, state.activeVideoWordId]
  );
  const replayItems = useMemo(
    () =>
      level.words.map((word) => ({
        wordId: word.id,
        label: word.value,
        found: state.foundWordIds.has(word.id),
      })),
    [level.words, state.foundWordIds]
  );

  const { activeSelection, onMouseStart, onMouseMove, onMouseEnd } = useGridSelection({
    gridSize: level.gridSize,
    onSelectionCommitted: (path: GridCell[]) => {
      dispatch({ type: 'selection_committed', path });
    }
  });
  const { layerTransforms, onPointerMove, onPointerLeave } = useParallax('high');

  const isVideoOpen = state.phase === 'video_open' && activeMediaWord !== null;
  const isCompleted = state.phase === 'completed';
  const isBooting = boot.phase !== 'ready';

  return (
    <main className="game-shell">
      <ParallaxBackdrop
        layerTransforms={layerTransforms}
        className="parallax-backdrop parallax-backdrop-global bunker-scene-art"
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
                <h2>{ru.completion.title}</h2>
                <p>{ru.completion.subtitle}</p>
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
                canvasSize={GRID_CANVAS_SIZE}
                layoutMode="viewport-fit"
              />
              <ProgressPanel
                foundCount={state.foundWordIds.size}
                totalCount={level.words.length}
                replayItems={replayItems}
                onReplayRequested={(wordId) => dispatch({ type: 'video_replay_requested', wordId })}
              />
            </div>

            {isBooting && (
              <BootOverlay
                lines={boot.visibleLines}
                visibleLineCount={boot.visibleLineCount}
                phase={boot.phase}
              />
            )}
          </ScreenViewport>
        </MonitorFrame>
      </SceneStage>

      {isVideoOpen && activeMediaWord && (
        <VideoOverlay word={activeMediaWord} onClose={() => dispatch({ type: 'video_closed' })} />
      )}

      <FxLayer />
    </main>
  );
}
