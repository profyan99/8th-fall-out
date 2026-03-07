import type { PropsWithChildren } from "react";

export function MonitorFrame({ children }: PropsWithChildren) {
  return (
    <div className="monitor-frame" data-testid="monitor-frame">
      <div className="monitor-bezel-depth" data-testid="monitor-bezel-depth" aria-hidden="true" />
      <div className="monitor-glass" data-testid="monitor-glass" aria-hidden="true" />
      <div className="monitor-reflection" data-testid="monitor-reflection" aria-hidden="true" />
      <div className="monitor-glare-sweep" data-testid="monitor-glare-sweep" aria-hidden="true" />
      {children}
    </div>
  );
}
