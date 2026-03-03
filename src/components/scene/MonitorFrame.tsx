import type { PropsWithChildren } from "react";

export function MonitorFrame({ children }: PropsWithChildren) {
  return (
    <div className="monitor-frame" data-testid="monitor-frame">
      {children}
    </div>
  );
}

