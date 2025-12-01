// engine.tsx
"use client";

export function KanbanDndProvider({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    // Right now this is just a passthrough – you can make this a context later.
    return <>{children}</>;
}
