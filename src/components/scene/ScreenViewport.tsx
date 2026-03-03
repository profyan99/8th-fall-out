import type { PropsWithChildren } from "react";

export function ScreenViewport({ children }: PropsWithChildren) {
  return (
    <div className="screen-viewport" data-testid="screen-viewport">
      {children}
    </div>
  );
}

