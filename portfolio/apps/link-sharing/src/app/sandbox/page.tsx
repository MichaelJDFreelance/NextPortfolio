"use client"

import {draggable, dropTargetForElements} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {useEffect, useRef, useState} from "react";
import {attachClosestEdge, Edge, extractClosestEdge} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

function useElementRef() {
    const ref = useRef<HTMLElement>(null);
    return [ref, () => ref.current] as const;
}

function useDraggable(type:string, data = {}) {
    const [ref, getEl] = useElementRef();

   useEffect(() => {
        const el = getEl();
        if (!el) return;

        return draggable({
            element: el,
            getInitialData: () => ({ type, ...data }),
        });
    }, [type, JSON.stringify(data)]);

    return { ref };
}

function useDropTarget({ for: acceptedTypes, options }: { for: string[]; options?: {allowedEdges:Edge[], onDrop?:(edge:string)=>void} }) {
    const [ref, getEl] = useElementRef();
    const [closestEdge, setClosestEdge] = useState<string|null>(null);

    useEffect(() => {
        const el = getEl();
        if (!el) return;

        return dropTargetForElements({
            element: el,

            canDrop({ source }) {
                return acceptedTypes.includes(source.data.type as string);
            },

            getIsSticky: () => true,

            getData({ input, element }) {
                const data = { type: acceptedTypes[0] };
                return attachClosestEdge(data, {
                    input,
                    element,
                    allowedEdges: options?.allowedEdges||["top", "bottom"],
                });
            },

            onDragEnter({ self }) {
                setClosestEdge(extractClosestEdge(self.data));
            },

            onDrag({ self }) {
                setClosestEdge(extractClosestEdge(self.data));
            },

            onDragLeave() {
                setClosestEdge(null);
            },

            onDrop({ self }) {
                const edge = extractClosestEdge(self.data);
                if (edge === null) return;
                setClosestEdge(null);
                options?.onDrop?.(edge);
            },
        });
    }, [acceptedTypes.join(","), JSON.stringify(options)]);

    return { ref, closestEdge };
}

function Row({ id, onReorder }:{id:string, onReorder:(opts: { id: string; edge: string }) => void}) {
    const { ref: dragRef } = useDraggable("profile-link", { id });

    const { ref: dropRef, closestEdge } = useDropTarget({
        for: ["profile-link"],
        options: {
            allowedEdges: ["top", "bottom"],
            onDrop(edge:string) {
                onReorder({ id, edge });
            },
        },
    });

    return (
        <div
            ref={(el) => {
                dragRef.current = el;
                dropRef.current = el;
            }}
            className={closestEdge!}
        >
            Row {id}
        </div>
    );
}


export function SandboxPage() {
    return (
        <></>
    );
}