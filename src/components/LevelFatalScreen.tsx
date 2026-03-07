type FatalReason = 'missing_level' | 'unknown_level';

type LevelFatalScreenProps = {
  reason: FatalReason;
  requestedLevel?: string | null;
  availableLevels: string[];
};

const reasonText: Record<FatalReason, string> = {
  missing_level: 'LEVEL IDENTIFIER NOT PROVIDED',
  unknown_level: 'LEVEL IDENTIFIER NOT RECOGNIZED'
};

export function LevelFatalScreen({ reason, requestedLevel = null, availableLevels }: LevelFatalScreenProps) {
  return (
    <main className="fatal-screen-shell">
      <section className="fatal-screen-panel" role="alert" aria-live="assertive">
        <h1>FATAL SYSTEM EXCEPTION</h1>
        <p className="fatal-screen-reason">{reasonText[reason]}</p>
        <p>Launch with: /?level=&lt;name&gt;</p>
        {reason === 'unknown_level' && (
          <p data-testid="fatal-requested-level">Requested: {requestedLevel ?? '(null)'}</p>
        )}
        <p>Available: {availableLevels.join(', ')}</p>
      </section>
    </main>
  );
}
