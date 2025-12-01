import {createActor, setup, SnapshotFrom, assign} from "xstate";
import {Store} from "@tanstack/react-store";
import {boardStore, lookupDerived} from "@/lib/store/boardStore";
import {handleDragOverStable} from "@/lib/ui/handleDragOverStable";
import {moveColumn, moveTask} from "@/lib/yjs/mutators";

type DragEndEvent = any

type DropTaskEvent = {
    type: "DROP_TASK";
    event: DragEndEvent;
};

type DropColumnEvent = {
    type: "DROP_COLUMN";
    event: DragEndEvent;
};

type StartDragEvent = {
    type: "START_DRAG";
};

type CancelDragEvent = {
    type: "CANCEL_DRAG";
};

type YjsReadyEvent = {
    type: "YJS_READY";
};

type ModalEvents =
    | { type: "OPEN_MODAL" }
    | { type: "CLOSE_MODAL" };

type DragEvents =
    | { type: "DROP" };

type ModalType =
    | "addColumn"
    | "editColumn"
    | "deleteColumn"
    | "addTask"
    | "editTask"
    | "deleteTask"
    | "viewTask"
    | "settings"
    | "confirm";

type ModalPayload = {
    taskId?: string;
    columnId?: string;
    boardId?: string;
    message?: string;
};

type UIEvents =
    | { type: "YJS_READY" }
    | { type: "START_DRAG"; event: any }
    | { type: "DROP_TASK"; event: any }
    | { type: "DROP_COLUMN"; event: any }
    | { type: "CANCEL_DRAG" }
    // Modal events:
    | { type: "OPEN_MODAL"; modal: ModalType; payload?: ModalPayload }
    | { type: "CLOSE_MODAL" }
    | { type: "DRAG_OVER", event: any };


/* ──────────────────────────────────────────────
 * CONTEXT
 * ────────────────────────────────────────────── */

interface UIContext {
    modal?: ModalType;         // name of modal
    modalPayload?: ModalPayload;

    // Existing UI context fields:
    dragActive: boolean;
}

export function computeProjectedColumns(
    prevShadow: Record<string, string[]>,
    lookup: any,
    activeId: string,
    overId: string | null,
    toColumn: string | null
): Record<string, string[]> {

    if (!overId || !toColumn) return prevShadow;

    // 1. Establish baseline from prevShadow or lookup
    const base = Object.keys(prevShadow).length > 0
        ? prevShadow
        : Object.fromEntries(
            [...lookup.tasksByColumn].map(([colId, ids]) => [
                colId,
                [...ids], // clone ONCE
            ])
        );

    // 2. Find old column
    const fromColumn = Object.keys(base).find(colId =>
        base[colId].includes(activeId)
    );

    if (!fromColumn) return base;

    // 3. Clean next reference (shallow clone)
    const next = base === prevShadow ? { ...base } : base;

    // 4. REMOVE activeId from all columns (prevents duplicates 100%)
    for (const colId of Object.keys(next)) {
        const list = next[colId];
        if (list.includes(activeId)) {
            next[colId] = list.filter((id:any) => id !== activeId);
        }
    }

    // 5. Target list (may not exist yet)
    const targetList = next[toColumn] ?? [];

    // 6. Compute clean insertion index
    const overIndex = targetList.indexOf(overId);
    const insertIndex = overIndex === -1 ? targetList.length : overIndex;

    // 7. Insert exactly once
    const newTarget = [...targetList];
    newTarget.splice(insertIndex, 0, activeId);

    next[toColumn] = newTarget;

    return next;
}

export function moveColumnById(
    yBoard: any,
    columnId: string,
    overColumnId: string,
    edge: "left" | "right",
) {
    console.log("moveColumnById", columnId, overColumnId, edge)
    const columnOrder = yBoard.get("columnOrder") as any;

    const arr = columnOrder.toArray();

    const fromIndex = arr.indexOf(columnId);
    const overIndex = arr.indexOf(overColumnId);

    if (fromIndex === -1 || overIndex === -1) return;

    const toIndex = edge === "left" ? overIndex : overIndex + 1;

    moveColumn(yBoard, fromIndex, toIndex)
}

/* -------------------------------------------------------------------------- */
/*                           MACHINE OPTIONS: LOGIC                           */
/* -------------------------------------------------------------------------- */

export const uiMachine = setup({
    types: {
        context: {} as UIContext,
        events: {} as UIEvents,
    },

    actions: {
        setModal: assign(({ event }) => ({
            modal: event.type === "OPEN_MODAL" ? event.modal : undefined,
            modalPayload: event.type === "OPEN_MODAL" ? event.payload ?? {} : {},
        })),

        clearModal: assign({
            modal: (_) => undefined,
            modalPayload: (_) => undefined,
        }),

        startDrag: assign({
            dragActive: (_) => true,
        }),

        endDrag: assign({
            dragActive: (_) => false,
        }),

        // ⭐ NEW: Handle task drop
        handleTaskDrop: ({ event, context }) => {
            console.log("handleTaskDrop", event, context)
            if (event.type !== "DROP_TASK") return;

            const yBoard = boardStore.state?.CRDT
            if (!yBoard) return;

            const {taskId, fromColumnId, toColumnId, index } = event.event;

            moveTask(yBoard, taskId, fromColumnId, toColumnId, index)
        },

        handleDragOver: ({ event }) => {
            if (event.type !== "DRAG_OVER") return;

            handleDragOverStable(event.event, lookupDerived.state);
        },

        // ⭐ NEW: Handle column drop
        handleColumnDrop: ({ event }) => {
            console.log("handleColumnDrop", event)

            if (event.type !== "DROP_COLUMN") return;

            const yBoard = boardStore.state?.CRDT
            if (!yBoard) return;

            const { columnId, overColumnId, edge } = event.event;

            console.log("event.event", event.event)

            moveColumnById(yBoard, columnId, overColumnId, edge)
        },
    },

    guards: {
        modalAllowed: ({ context }) => context.dragActive === false,
    },
}).createMachine({
    id: "ui",

    /* Initial context */
    context: {
        modal: undefined,
        modalPayload: undefined,
        dragActive: false,
    },

    /* ──────────────────────────────────────────────
     * PARALLEL STATES
     * app / drag / modal
     * ────────────────────────────────────────────── */
    type: "parallel",

    states: {
        /* ---------- APP LOADING ---------- */
        app: {
            initial: "loading",
            states: {
                loading: {
                    on: { YJS_READY: "ready" },
                },
                ready: {},
            },
        },

        /* ---------- DRAG STATE ---------- */
        drag: {
            initial: "idle",
            states: {
                idle: {
                    on: {
                        START_DRAG: {
                            target: "dragging",
                            actions: "startDrag",
                        },
                    },
                },

                dragging: {
                    on: {
                        DRAG_OVER: {
                            target: "dragging",
                            actions: "handleDragOver",
                        },
                        DROP_TASK: {
                            target: "idle",
                            actions: ["handleTaskDrop", "endDrag"],
                        },
                        DROP_COLUMN: {
                            target: "idle",
                            actions: ["handleColumnDrop", "endDrag"],
                        },
                        CANCEL_DRAG: {
                            target: "idle",
                            actions: "endDrag",
                        },
                    },
                },
            },
        },

        /* ---------- MODAL STATE ---------- */
        modal: {
            initial: "closed",

            states: {
                closed: {
                    on: {
                        OPEN_MODAL: {
                            guard: "modalAllowed",
                            target: "open",
                            actions: "setModal",
                        },
                    },
                },

                open: {
                    on: {
                        CLOSE_MODAL: {
                            target: "closed",
                            actions: "clearModal",
                        },
                    },
                },
            },
        },
    },
});

type UiSnapshot = SnapshotFrom<typeof uiMachine>;

type UiMachineStoreState = { snapshot:  UiSnapshot | null };

export const uiStore = new Store<UiMachineStoreState>({
    snapshot: null,   // will hold XState snapshot
});

export const uiService = createActor(uiMachine);

// Sync XState snapshot → TanStack Store
uiService.subscribe((snapshot) => {
    uiStore.setState({ snapshot });
});

// Start the actor
uiService.start();