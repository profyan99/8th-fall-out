import type { PropsWithChildren } from "react";

export function MonitorFrame({ children }: PropsWithChildren) {
  return (
    <div className="monitor-frame" data-testid="monitor-frame">
      <div className="monitor-glass" aria-hidden="true" />
      <div className="monitor-reflection" aria-hidden="true" />
      {children}
    </div>
  );
}
