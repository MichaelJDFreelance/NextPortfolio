import {createActor, createMachine, setup, SnapshotFrom, assign} from "xstate";
import {Store} from "@tanstack/react-store";
import {moveColumn, moveTask} from "@/lib/yjs/mutators";
import {boardStore} from "@/lib/store/boardStore";
import {lookupDerived} from "@/lib/store/boardStore";

import type { DragEndEvent } from "@dnd-kit/core";

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
    | { type: "CLOSE_MODAL" };


/* ──────────────────────────────────────────────
 * CONTEXT
 * ────────────────────────────────────────────── */

interface UIContext {
    modal?: ModalType;         // name of modal
    modalPayload?: ModalPayload;

    // Existing UI context fields:
    dragActive: boolean;
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
            const { active, over } = event.event;
            if (!active || !over) return;

            const a = active.data?.current;
            const o = over.data?.current;
            if (!a || !o) return;

            // You stored the Yjs board in TanStack store, not XState context
            // So access it from a helper (boardStore.state?.CRDT)
            const yBoard = boardStore.state?.CRDT;
            if (!yBoard) return;

            moveTask(
                yBoard,
                a.taskId,
                a.columnId,
                o.columnId,
                o.index
            );
        },

        // ⭐ NEW: Handle column drop
        handleColumnDrop: ({ event }) => {
            const { active, over } = event.event;
            if (!active || !over) return;

            const fromIndex = active.data.current?.index;
            const toIndex = over.data.current?.index;

            if (fromIndex === undefined || toIndex === undefined) return;

            const yBoard = boardStore.state?.CRDT;
            if (!yBoard) return;

            moveColumn(yBoard, fromIndex, toIndex);
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