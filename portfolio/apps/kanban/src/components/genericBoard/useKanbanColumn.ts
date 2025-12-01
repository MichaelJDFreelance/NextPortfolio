import {RefObject, useEffect, useRef, useState} from "react";
import { draggable, dropTargetForElements, } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {attachClosestEdge, Edge, extractClosestEdge,} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {preserveOffsetOnSource} from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import {dropTargetForExternal} from "@atlaskit/pragmatic-drag-and-drop/external/adapter";

export function useTaskDropTarget(
    columnId: string,
    tasksRef: React.RefObject<HTMLElement|null>,
    onTaskDrop: (args: any) => void
) {
    useEffect(() => {
        if (!tasksRef.current) return;

        return dropTargetForElements({
            element: tasksRef.current,
            getData: () => ({
                type: "kanban-task-container",
                columnId,
            }),
        });
    }, []);

    useEffect(() => {
        console.log("useTaskDropTarget", columnId, tasksRef);

        const el = tasksRef.current;
        if (!el) return;

        return monitorForElements({
            onDrop({ source, location }) {
                // Only handle task drags
                if (source.data.type !== "kanban-task") return;

                // KEY FIX: ensure drop happened INSIDE THIS column
                const containerEntry = (location.current?.dropTargets ?? []).find(
                    (t) =>
                        t.data.type === "kanban-task-container" &&
                        t.data.columnId === columnId
                );

                if (!containerEntry) return; // ignore drops for other columns

                // Now safe to compute reorder logic
                const taskNodes = Array.from(
                    el.querySelectorAll("[data-task-id]")
                ) as HTMLElement[];

                const draggedId = source.data.taskId;

                /*const draggedIndex = taskNodes.findIndex(
                    (t) => t.dataset.taskId === draggedId
                );

                console.log("source.data", source.data);
                console.log("taskNode Ids", taskNodes.map((t) => t.dataset.taskId));
*/
                // Find task under pointer
                const targetEntry = (location.current?.dropTargets ?? []).find(
                    (t) =>
                        t.data.type === "kanban-task"
                        &&  t.data.columnId === columnId
                );

                console.log("targetEntry", targetEntry);

                let index: number;

                if (!targetEntry) {
                    index = taskNodes.length;
                } else {
                    const targetId = targetEntry.data.taskId;
                    const targetIndex = taskNodes.findIndex(
                        (t) => t.dataset.taskId === targetId
                    );

                    const closestEdge = extractClosestEdge(targetEntry.data);

                    if (closestEdge === "top") {
                        index = targetIndex;
                    }
                    else {
                        index = targetIndex + 1;
                    }

                    /*index = getReorderDestinationIndex({
                        startIndex: draggedIndex,
                        indexOfTarget: targetIndex,
                        closestEdgeOfTarget: closestEdge,
                        axis: "vertical",
                    });

                    console.log("index", draggedIndex, targetIndex, closestEdge);*/
                }

                onTaskDrop({
                    taskId: draggedId,
                    fromColumnId: source.data.fromColumnId,
                    toColumnId: columnId,
                    index,
                });
            },
        });
    }, [columnId]);
}

type ColumnEdge = "left" | "right";

export function useColumnDnd(
    columnId: string,
    columnRef: RefObject<HTMLElement | null>,
    headerRef: RefObject<HTMLElement | null>,
    onColumnDrop: (args: {
        columnId: string;
        overColumnId: string;
        edge: ColumnEdge;
    }) => void,
    onDragStart?: () => void,
    onDragMove?: (args: { x: number; y: number }) => void,
    onDragCancel?: () => void
) {
    const [closestEdge, setClosestEdge] = useState<ColumnEdge | null>(null);

    useEffect(() => {
        const columnEl = columnRef.current;
        const headerEl = headerRef.current;
        if (!columnEl || !headerEl) return;

        return combine(
            // 1. Column is draggable, with header as drag handle
            draggable({
                element: columnEl,
                dragHandle: headerEl,
                getInitialData: () => ({
                    type: "kanban-column",
                    columnId,
                }),
                onDrag: ({ location }) => {
                    onDragStart?.()
                },
            }),

            // 2. Column can receive drops from other columns (left/right edges)
            dropTargetForElements({
                element: columnEl,

                canDrop: ({ source }) =>
                    source.data.type === "kanban-column" &&
                    source.data.columnId !== columnId,

                getIsSticky: () => true,

                getData({ input, element }) {
                    const data = { type: "kanban-column", columnId };
                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["left", "right"],
                    });
                },

                onDragEnter(args) {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "left" || edge === "right") {
                        setClosestEdge(edge);
                    }
                },

                onDrag(args) {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "left" || edge === "right") {
                        setClosestEdge(edge);
                    }
                },

                onDragLeave() {
                    setClosestEdge(null);
                },

                onDrop({ source, self }) {
                    const edge = extractClosestEdge(self.data);

                    // Ignore invalid edges (type narrowing)
                    if (edge !== "left" && edge !== "right") return;

                    setClosestEdge(null);

                    onColumnDrop({
                        columnId: source.data.columnId as string,
                        overColumnId: columnId,
                        edge,
                    });
                },
            })
        );
    }, [columnId, columnRef, headerRef, onColumnDrop]);

    return { closestEdge };
}

type TaskDragState =
    | { type: "idle" }
    | { type: "preview"; container: HTMLElement; rect: DOMRect }
    | { type: "dragging" };

const idleState: TaskDragState = { type: "idle" };
const draggingState: TaskDragState = { type: "dragging" };

export function useTaskDnd(taskId: string, columnId: string, onDragStart?: () => void, onDragMove?: (args: { x: number; y: number }) => void, onDragCancel?: () => void) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
    const [state, setState] = useState<TaskDragState>(idleState);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        return combine(
            // 1. Draggable
            draggable({
                element: el,
                getInitialData: () => ({
                    type: "kanban-task",
                    taskId,
                    fromColumnId: columnId,
                }),
                onDrag: ({ location }) => {
                    onDragStart?.()
                },
                onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
                    const rect = source.element.getBoundingClientRect();

                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: preserveOffsetOnSource({
                            element: el,
                            input: location.current.input,
                        }),
                        render({ container }) {
                            setState({ type: "preview", container, rect });
                            return () => setState(draggingState);
                        },
                    });
                },
                onDragStart: () => setState(draggingState),
                onDrop: () => {
                    setState(idleState);
                    setClosestEdge(null);
                },
            }),

            // 2. Task accepts files/external drags too
            dropTargetForExternal({
                element: el,
            }),

            // 3. Task is a drop target for reordering
            dropTargetForElements({
                element: el,
                canDrop: ({ source }) =>
                    source.data.type === "kanban-task" &&
                    source.data.taskId !== taskId,

                getIsSticky: () => true,

                getData({ input, element }) {
                    const data = { type: "kanban-task", taskId, columnId };

                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    });
                },

                onDragEnter: (args) => {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "top" || edge === "bottom") {
                        setClosestEdge(edge);
                    }
                },

                onDrag: (args) => {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "top" || edge === "bottom") {
                        setClosestEdge(edge);
                    }
                },

                onDragLeave: () => setClosestEdge(null),

                onDrop: () => {
                    setClosestEdge(null);
                },
            })
        );
    }, [taskId, columnId]);

    return { ref, state, closestEdge };
}

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

