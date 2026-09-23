import * as React from "react";

type CoverTransitionProps = {
  name: string;
  enabled?: boolean;
  children: React.ReactNode;
};

type TransitionProps = {
  name: string;
  share?: string;
  default?: string;
  children: React.ReactNode;
};

const Transition = (
  React as unknown as { ViewTransition?: React.ComponentType<TransitionProps> }
).ViewTransition;

export function CoverTransition({
  name,
  enabled = true,
  children,
}: CoverTransitionProps) {
  if (!enabled) return children;
  if (!Transition) {
    return (
      <div style={{ viewTransitionName: name }} className="cover-share">
        {children}
      </div>
    );
  }
  return (
    <Transition name={name} share="cover-share" default="none">
      {children}
    </Transition>
  );
}
