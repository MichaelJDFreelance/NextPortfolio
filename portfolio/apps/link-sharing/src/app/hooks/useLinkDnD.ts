// useLinkDnd.ts
import { useRef, useEffect, useState } from "react";
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
    attachClosestEdge,
    extractClosestEdge,
    Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export function useLinkDnd(
    linkId: string,
    reorder: (opts: { draggedId: string; targetId: string; edge: Edge }) => void
) {
    const ref = useRef<HTMLElement | null>(null);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    // Draggable
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({
                type: "profile-link",
                linkId,
            }),
            onDrop() {
                setClosestEdge(null);
            },
        });
    }, [linkId]);

    // Drop Target (each link is a reorder target)
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return dropTargetForElements({
            element: el,

            canDrop({ source }) {
                return (
                    source.data.type === "profile-link" &&
                    source.data.linkId !== linkId
                );
            },

            getIsSticky: () => true,

            getData({ input, element }) {
                const data = { type: "profile-link", linkId };
                return attachClosestEdge(data, {
                    input,
                    element,
                    allowedEdges: ["top", "bottom"],
                });
            },

            onDragEnter(args) {
                const edge = extractClosestEdge(args.self.data);
                setClosestEdge(edge as Edge);
            },

            onDrag(args) {
                const edge = extractClosestEdge(args.self.data);
                setClosestEdge(edge as Edge);
            },

            onDragLeave() {
                setClosestEdge(null);
            },

            onDrop({ source, self }) {
                setClosestEdge(null);

                reorder({
                    draggedId: source.data.linkId as string,
                    targetId: self.data.linkId as string,
                    edge: extractClosestEdge(self.data) as Edge,
                });
            },
        });
    }, [linkId, reorder]);

    return { ref, closestEdge };
}
