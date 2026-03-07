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
      <p className="terminal-hud-session">SESSION::{sessionId}</p>
      <p className="terminal-hud-status">LINK STABLE</p>
      <p className="terminal-hud-progress" data-testid="hud-progress">{`WORDS LOCATED ${foundCount}/${totalCount}`}</p>
    </header>
  );
}
