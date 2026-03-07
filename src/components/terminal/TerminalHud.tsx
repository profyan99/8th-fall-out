import { ru } from '../../i18n/ru';

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
      <p className="terminal-hud-session">{ru.hud.sessionPrefix}{sessionId}</p>
      <p className="terminal-hud-status">{ru.hud.linkStable}</p>
      <p className="terminal-hud-progress" data-testid="hud-progress">{`${ru.hud.wordsLocated} ${foundCount}/${totalCount}`}</p>
    </header>
  );
}
