import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { LevelFatalScreen } from './LevelFatalScreen';

describe('LevelFatalScreen', () => {
  test('renders missing level message and hint with alert role', () => {
    render(
      <LevelFatalScreen
        reason="missing_level"
        requestedLevel={null}
        availableLevels={['01', 'test']}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('FATAL SYSTEM EXCEPTION')).toBeInTheDocument();
    expect(screen.getByText('LEVEL IDENTIFIER NOT PROVIDED')).toBeInTheDocument();
    expect(screen.getByText('Launch with: /?level=<name>')).toBeInTheDocument();
  });

  test('renders unknown level message and requested level value', () => {
    render(
      <LevelFatalScreen
        reason="unknown_level"
        requestedLevel="bogus"
        availableLevels={['01', 'test']}
      />
    );

    expect(screen.getByText('LEVEL IDENTIFIER NOT RECOGNIZED')).toBeInTheDocument();
    expect(screen.getByTestId('fatal-requested-level')).toHaveTextContent('bogus');
  });
});
