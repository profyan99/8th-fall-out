import type { GridCell, LevelDefinition } from './types';
import { validateSelection } from './wordValidation';

export type GamePhase = 'idle' | 'selecting' | 'video_open' | 'completed';

export type GameState = {
  level: LevelDefinition;
  phase: GamePhase;
  activeSelection: GridCell[];
  foundWordIds: Set<string>;
  activeVideoWordId: string | null;
};

export type GameAction =
  | { type: 'selection_started'; path: GridCell[] }
  | { type: 'selection_updated'; path: GridCell[] }
  | { type: 'selection_committed'; path: GridCell[] }
  | { type: 'selection_cleared' }
  | { type: 'video_closed' };

export const createInitialGameState = (level: LevelDefinition): GameState => ({
  level,
  phase: 'idle',
  activeSelection: [],
  foundWordIds: new Set(),
  activeVideoWordId: null
});

const nextPhaseAfterVideoClose = (state: GameState): GamePhase =>
  state.foundWordIds.size === state.level.words.length ? 'completed' : 'idle';

export const reduceGameState = (state: GameState, action: GameAction): GameState => {
  if (state.phase === 'completed') {
    return state;
  }

  switch (action.type) {
    case 'selection_started':
    case 'selection_updated':
      return {
        ...state,
        phase: 'selecting',
        activeSelection: action.path
      };

    case 'selection_cleared':
      return {
        ...state,
        phase: 'idle',
        activeSelection: []
      };

    case 'selection_committed': {
      const result = validateSelection(state.level, state.foundWordIds, action.path);

      if (result.status !== 'found' || !result.word) {
        return {
          ...state,
          phase: 'idle',
          activeSelection: []
        };
      }

      const foundWordIds = new Set(state.foundWordIds);
      foundWordIds.add(result.word.id);

      return {
        ...state,
        phase: 'video_open',
        foundWordIds,
        activeSelection: [],
        activeVideoWordId: result.word.id
      };
    }

    case 'video_closed': {
      const nextState = {
        ...state,
        activeVideoWordId: null
      };

      return {
        ...nextState,
        phase: nextPhaseAfterVideoClose(nextState)
      };
    }

    default:
      return state;
  }
};
