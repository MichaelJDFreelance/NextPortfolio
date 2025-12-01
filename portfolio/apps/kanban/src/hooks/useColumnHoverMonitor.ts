import { useEffect, useRef, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export function useColumnHoverMonitor(dataType: string) {
    const [columnHoverId, setColumnHoverId] = useState<string | null>(null);

    // The caller attaches this to the horizontal container that holds all columns
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return monitorForElements({
            onDrag: ({ source, location }) => {
                // Ignore everything except drags of the given type exactly like before
                if (source.data.type !== dataType) {
                    setColumnHoverId(null);
                    return;
                }

                if (!containerRef.current) return;

                const targets = location.current?.dropTargets ?? [];

                // Find which column header/container is under the pointer
                const columnTargets = targets.filter(
                    (t) => t.data.type === dataType
                );

                if (columnTargets.length === 0) {
                    setColumnHoverId(null);
                    return;
                }

                // There should only be one matching target:
                const target = columnTargets[0];

                // Which edge (left/right) of this column is closest?
                const closestEdge = extractClosestEdge(target.data);

                /**
                 * If the closestEdge is LEFT → the user intends to insert before this column.
                 * If the closestEdge is RIGHT → the user intends to insert after this column
                 */
                const columnId = target.data.columnId as string;

                // For LEFT edge, return this column
                if (closestEdge === "left") {
                    setColumnHoverId(columnId);
                    return;
                }

                // For the RIGHT edge, choose the *next* column in the row
                if (closestEdge === "right") {
                    const columns = Array.from(
                        containerRef.current.querySelectorAll("[data-column-id]")
                    ) as HTMLElement[];

                    const index = columns.findIndex((el) => el.dataset.columnId === columnId);

                    const next = columns[index + 1];
                    setColumnHoverId(next?.dataset.columnId ?? null);
                    return;
                }

                // If no edge detected, reset
                setColumnHoverId(null);
            },

            onDrop: () => {
                setColumnHoverId(null);
            },
        });
    }, [dataType]);

    return { columnHoverId, containerRef };
}
