import {onMount, createEffect, createSignal} from "solid-js";
import { draggable, dropTargetForElements, } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {attachClosestEdge, Edge, extractClosestEdge,} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {setCustomNativeDragPreview} from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {preserveOffsetOnSource} from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import {dropTargetForExternal} from "@atlaskit/pragmatic-drag-and-drop/external/adapter";

export function createTaskDropTarget(props: {
    columnId: string;
    tasksRef: () => HTMLElement | null;
    onTaskDrop: (args: any) => void;
}) {
    const { columnId, tasksRef, onTaskDrop } = props;

    // Setup drop target
    onMount(() => {
        const el = tasksRef();
        if (!el) return;

        const cleanup = dropTargetForElements({
            element: el,
            getData: () => ({
                type: "kanban-task-container",
                columnId,
            }),
        });

        return cleanup;
    });

    // Attach monitor once, but reactively read columnId
    onMount(() => {
        console.log("Registering TASK drop target for column", columnId, "element:", tasksRef());
        const cleanup = monitorForElements({
            onDrop({ source, location }) {

                if (source.data.type !== "kanban-task") return;

                const el = tasksRef();
                if (!el) return;

                const containerEntry = (location.current?.dropTargets ?? []).find(
                    (t) =>
                        t.data.type === "kanban-task-container" &&
                        t.data.columnId === columnId
                );

                if (!containerEntry) return;

                // Collect current task DOM order
                const taskNodes = Array.from(
                    el.querySelectorAll("[data-task-id]")
                ) as HTMLElement[];

                const draggedId = source.data.taskId;

                // Find item under pointer
                const targetEntry = (location.current?.dropTargets ?? []).find(
                    (t) =>
                        t.data.type === "kanban-task" &&
                        t.data.columnId === columnId
                );

                let index: number;

                if (!targetEntry) {
                    index = taskNodes.length;
                } else {
                    const targetId = targetEntry.data.taskId;
                    const targetIndex = taskNodes.findIndex(
                        (t) => t.dataset.taskId === targetId
                    );

                    const closestEdge = extractClosestEdge(targetEntry.data);
                    index = closestEdge === "top" ? targetIndex : targetIndex + 1;
                }



                onTaskDrop({
                    taskId: draggedId,
                    fromColumnId: source.data.fromColumnId,
                    toColumnId: columnId,
                    index,
                });
            },
        });

        return cleanup;
    });
}

type ColumnEdge = "left" | "right";

export function createColumnDnd(options: {
    columnId: string;
    columnRef: () => HTMLElement | null;
    headerRef: () => HTMLElement | null;
    onColumnDrop: (args: {
        columnId: string;
        overColumnId: string;
        edge: ColumnEdge;
    }) => void;
    onDragStart?: () => void;
    onDragMove?: (args: { x: number; y: number }) => void;
    onDragCancel?: () => void;
}) {
    const {
        columnId,
        columnRef,
        headerRef,
        onColumnDrop,
        onDragStart,
        onDragMove,
        onDragCancel,
    } = options;

    // Solid state
    const [closestEdge, setClosestEdge] = createSignal<ColumnEdge | null>(null);

    // Set up DnD exactly once
    onMount(() => {
        const col = columnRef();
        const head = headerRef();
        if (!col || !head) return;

        const cleanup = combine(
            draggable({
                element: col,
                dragHandle: head,
                getInitialData: () => ({
                    type: "kanban-column",
                    columnId,  // captured and stable
                }),
                onDrag: () => {
                    onDragStart?.();
                },
            }),

            dropTargetForElements({
                element: col,

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

        return cleanup;
    });

    return {
        closestEdge, // signal; consumers read as closestEdge()
    };
}

type TaskDragState =
    | { type: "idle" }
    | { type: "preview"; container: HTMLElement; rect: DOMRect }
    | { type: "dragging" };

const idleState: TaskDragState = { type: "idle" };
const draggingState: TaskDragState = { type: "dragging" };

export function createTaskDnd(options: {
    taskId: string;
    columnId: () => string; // important: now a signal getter
    onDragStart?: () => void;
    onDragMove?: (args: { x: number; y: number }) => void;
    onDragCancel?: () => void;
}) {
    const [closestEdge, setClosestEdge] = createSignal<Edge | null>(null);
    const [state, setState] = createSignal<TaskDragState>(idleState);

    const { taskId, columnId, onDragStart, onDragMove, onDragCancel } = options;

    let el: HTMLDivElement | null = null;
    const ref = (node: HTMLDivElement) => (el = node);

    createEffect(() => {
        const currentColumnId = columnId(); // ⬅ tracked
        if (!el) return;

        const cleanup = combine(
            draggable({
                element: el,
                getInitialData: () => ({
                    type: "kanban-task",
                    taskId,
                    fromColumnId: currentColumnId, // ← reactive!
                }),
                onDrag: () => onDragStart?.(),
                onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
                    const rect = source.element.getBoundingClientRect();
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: preserveOffsetOnSource({
                            element: el!,
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

            dropTargetForExternal({ element: el }),

            dropTargetForElements({
                element: el,
                canDrop: ({ source }) =>
                    source.data.type === "kanban-task" &&
                    source.data.taskId !== taskId,
                getIsSticky: () => true,
                getData({ input, element }) {
                    const data = { type: "kanban-task", taskId, columnId: currentColumnId };
                    return attachClosestEdge(data, {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    });
                },
                onDragEnter: args => {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "top" || edge === "bottom") setClosestEdge(edge);
                },
                onDrag: args => {
                    const edge = extractClosestEdge(args.self.data);
                    if (edge === "top" || edge === "bottom") setClosestEdge(edge);
                },
                onDragLeave: () => setClosestEdge(null),
                onDrop: () => setClosestEdge(null),
            })
        );

        // IMPORTANT: return cleanup, so Solid calls it when columnId changes
        return cleanup;
    });

    return {
        closestEdge,
        state,
        ref,
    };
}

export function createColumnHoverMonitor(dataType: string) {
    const [columnHoverId, setColumnHoverId] = createSignal<string | null>(null);

    let containerEl: HTMLDivElement | null = null;
    const containerRef = (el: HTMLDivElement) => (containerEl = el);

    onMount(() => {
        const cleanup = monitorForElements({
            onDrag: ({ source, location }) => {
                if (source.data.type !== dataType) {
                    setColumnHoverId(null);
                    return;
                }

                if (!containerEl) return;

                const targets = location.current?.dropTargets ?? [];

                const columnTargets = targets.filter(
                    (t) => t.data.type === dataType
                );

                if (columnTargets.length === 0) {
                    setColumnHoverId(null);
                    return;
                }

                const target = columnTargets[0];
                const closestEdge = extractClosestEdge(target.data);
                const columnId = target.data.columnId as string;

                if (closestEdge === "left") {
                    setColumnHoverId(columnId);
                    return;
                }

                if (closestEdge === "right") {
                    const columns = Array.from(
                        containerEl.querySelectorAll("[data-column-id]")
                    ) as HTMLElement[];

                    const index = columns.findIndex((el) =>
                        el.dataset.columnId === columnId
                    );

                    const next = columns[index + 1];
                    setColumnHoverId(next?.dataset.columnId ?? null);
                    return;
                }

                // No valid edge → reset
                setColumnHoverId(null);
            },

            onDrop: () => {
                setColumnHoverId(null);
            },
        });

        return cleanup;
    });

    return {
        columnHoverId,
        containerRef,
    };
}



