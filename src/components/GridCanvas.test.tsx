import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { GridCell } from '../domain/types';
import { GridCanvas } from './GridCanvas';

const letters = [
  ['A', 'B', 'C'],
  ['D', 'E', 'F'],
  ['G', 'H', 'I']
];

const selection: GridCell[] = [
  { row: 0, col: 0 },
  { row: 0, col: 1 }
];

const fillText = vi.fn();
const fillRect = vi.fn();

beforeEach(() => {
  fillText.mockReset();
  fillRect.mockReset();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect: vi.fn(),
    fillRect,
    strokeRect: vi.fn(),
    fillText,
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    set fillStyle(_value: string) {},
    set strokeStyle(_value: string) {},
    set lineWidth(_value: number) {},
    set font(_value: string) {},
    set textAlign(_value: CanvasTextAlign) {},
    set textBaseline(_value: CanvasTextBaseline) {}
  } as unknown as CanvasRenderingContext2D);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GridCanvas', () => {
  test('does not render debug metadata in UI', () => {
    render(
      <GridCanvas
        gridLetters={letters}
        activeSelection={[]}
        foundPaths={[]}
        onMouseStart={() => undefined}
        onMouseMove={() => undefined}
        onMouseEnd={() => undefined}
      />
    );

    expect(screen.queryByText(/rows:\d+/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/selection:\d+/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/found-cells:\d+/i)).not.toBeInTheDocument();
  });

  test('draws letters on canvas', () => {
    render(
      <GridCanvas
        gridLetters={letters}
        activeSelection={[]}
        foundPaths={[]}
        onMouseStart={() => undefined}
        onMouseMove={() => undefined}
        onMouseEnd={() => undefined}
      />
    );

    expect(fillText).toHaveBeenCalledWith('A', expect.any(Number), expect.any(Number));
    expect(fillText).toHaveBeenCalledTimes(9);
  });

  test('preserves input-blocked signal on rerender', () => {
    const { rerender } = render(
      <GridCanvas
        gridLetters={letters}
        activeSelection={[]}
        foundPaths={[]}
        onMouseStart={() => undefined}
        onMouseMove={() => undefined}
        onMouseEnd={() => undefined}
      />
    );

    rerender(
      <GridCanvas
        gridLetters={letters}
        activeSelection={selection}
        foundPaths={[]}
        onMouseStart={() => undefined}
        onMouseMove={() => undefined}
        onMouseEnd={() => undefined}
        isInputBlocked
      />
    );

    expect(screen.getByTestId('grid-canvas')).toHaveAttribute('data-input-blocked', 'true');
  });
});
