type TerminalHudProps = {
  title: string;
  sessionId: string;
  foundCount: number;
  totalCount: number;
};

export function TerminalHud({ title, sessionId, foundCount, totalCount }: TerminalHudProps) {
  return (
    <header className="terminal-hud">
      <h1>{title}</h1>
      <p className="terminal-hud-session">SESSION {sessionId}</p>
      <p data-testid="hud-progress">
        {foundCount}/{totalCount}
      </p>
    </header>
  );
}

