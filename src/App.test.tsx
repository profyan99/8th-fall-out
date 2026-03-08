import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';
import App from './App';

const setSearch = (search: string) => {
  window.history.replaceState({}, '', `/${search}`);
};

afterEach(() => {
  setSearch('');
});

describe('App level routing', () => {
  test('shows fatal screen when level query is missing', () => {
    setSearch('');
    render(<App />);

    expect(screen.getByText('FATAL SYSTEM EXCEPTION')).toBeInTheDocument();
    expect(screen.queryByText('Progress')).not.toBeInTheDocument();
  });

  test('shows fatal screen when level query is unknown', () => {
    setSearch('?level=unknown');
    render(<App />);

    expect(screen.getByText('FATAL SYSTEM EXCEPTION')).toBeInTheDocument();
    expect(screen.getByText('LEVEL IDENTIFIER NOT RECOGNIZED')).toBeInTheDocument();
  });

  test('shows game shell when level query is known', () => {
    setSearch('?level=for-girls');
    render(<App />);

    expect(screen.getByText(/для всех девушек/i)).toBeInTheDocument();
    expect(screen.queryByText('FATAL SYSTEM EXCEPTION')).not.toBeInTheDocument();
  });
});
