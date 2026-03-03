import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
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

describe('GridCanvas', () => {
  test('renders expected cell metadata', () => {
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

    expect(screen.getByTestId('grid-canvas-meta')).toHaveTextContent('rows:3 cols:3 cells:9');
  });

  test('updates selection metadata when selection changes', () => {
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
      />
    );

    expect(screen.getByTestId('grid-canvas-selection')).toHaveTextContent('selection:2');
  });
});
