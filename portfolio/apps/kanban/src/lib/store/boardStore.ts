import { Store, Derived } from "@tanstack/react-store";
import { getBoardById } from "@/lib/yjs/accessors";
import * as Y from "yjs";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type BoardSnapshot = {
    name: string;
    columns: {
        id: string;
        name: string;
        tasks: {
            id: string;
            title: string;
            description: string;
            status: string;
            subtasks: any[];
        }[];
    }[];
};

export type BoardLookup = {
    columnsById: Map<string, any>;
    tasksById: Map<string, any>;
    tasksByColumn: Map<string, string[]>;
    columnForTask: Map<string, string>;
};

type BoardStoreState = {
    id?: string;
    CRDT?: any; // yBoard
};

/* -------------------------------------------------------------------------- */
/*                                   STORE                                    */
/* -------------------------------------------------------------------------- */

export const boardStore = new Store<BoardStoreState | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                            DERIVED: LOOKUP (flat)                          */
/* -------------------------------------------------------------------------- */

// In lookupDerived.fn
export const lookupDerived = new Derived<BoardLookup | undefined>({
    deps: [boardStore],
    fn: () => {
        const state = boardStore.state;
        if (!state?.CRDT) return undefined;

        const yBoard = state.CRDT;

        const columnsVal = yBoard.get("columns") as any;
        const tasksVal = yBoard.get("tasks") as any;

        const columnsById = new Map<string, any>();
        const tasksById = new Map<string, any>();

        // NEW
        const tasksByColumn = new Map<string, string[]>();
        const columnForTask = new Map<string, string>();

        // --- load columns ---
        if (columnsVal instanceof Y.Map) {
            columnsVal.forEach((col: any, colId: string) => {
                columnsById.set(colId, col);

                // NEW: extract taskOrder for each column
                const taskOrder = col.get("taskOrder") as Y.Array<string>;
                if (taskOrder instanceof Y.Array) {
                    const ids = taskOrder.toArray();
                    tasksByColumn.set(colId, ids);

                    // NEW: build reverse mapping
                    for (const tId of ids) {
                        columnForTask.set(tId, colId);
                    }
                }
            });
        }

        // --- load tasks ---
        if (tasksVal instanceof Y.Map) {
            tasksVal.forEach((task: any, taskId: string) => {
                tasksById.set(taskId, task);
            });
        }

        return {
            columnsById,
            tasksById,

            // NEW OUTPUT
            tasksByColumn,
            columnForTask,
        };
    },
});


/* -------------------------------------------------------------------------- */
/*                   DERIVED: SNAPSHOT (rebuild old shape)                    */
/* -------------------------------------------------------------------------- */

export const snapshotDerived = new Derived<BoardSnapshot | undefined>({
    deps: [boardStore],
    fn: () => {
        const state = boardStore.state;
        if (!state?.CRDT) return undefined;

        const yBoard = state.CRDT;
        const name = yBoard.get("name") as string;

        const columnsVal = yBoard.get("columns") as any;
        const columnOrderVal = yBoard.get("columnOrder") as any;
        const tasksVal = yBoard.get("tasks") as any;

        // Require the new flattened shape for snapshot
        if (!(columnsVal instanceof Y.Map) ||
            !(columnOrderVal instanceof Y.Array) ||
            !(tasksVal instanceof Y.Map)) {
            // Old/partial shape: don't blow up the UI; just render nothing for now
            console.warn("[snapshotDerived] Board has legacy or incomplete shape");
            return undefined;
        }

        const columns = columnsVal as Y.Map<any>;
        const columnOrder = columnOrderVal as Y.Array<string>;
        const tasks = tasksVal as Y.Map<any>;

        const snapshotColumns = columnOrder.toArray().map((colId) => {
            const col = columns.get(colId);
            if (!col) {
                return {
                    id: colId,
                    name: "(missing column)",
                    tasks: [],
                };
            }

            const taskOrder = col.get("taskOrder") as Y.Array<string>;
            const colName = col.get("name");

            const colTasks = taskOrder.toArray().map((taskId) => {
                const task = tasks.get(taskId);
                if (!task) {
                    return {
                        id: taskId,
                        title: "(missing task)",
                        description: "",
                        status: "",
                        subtasks: [],
                    };
                }

                const subs = task.get("subtasks") as Y.Array<any>;

                return {
                    id: task.get("id"),
                    title: task.get("title"),
                    description: task.get("description") ?? "",
                    status: task.get("status") ?? "",
                    subtasks: subs ? subs.toArray() : [],
                };
            });

            return {
                id: colId,
                name: colName,
                tasks: colTasks,
            };
        });

        return {
            name,
            columns: snapshotColumns,
        };
    },
});


/* -------------------------------------------------------------------------- */
/*                        SYNC Yjs CRDT → Store State                         */
/* -------------------------------------------------------------------------- */

let detach: (() => void) | null = null;

function syncToCRDT(id: string | undefined) {
    if (!id) return;

    const yBoard = getBoardById(id);
    if (!yBoard) return;

    // Core state; Deriveds read from this
    boardStore.setState({
        id,
        CRDT: yBoard,
    });

    // Rebind deep observer
    if (detach) detach();

    const handler = () => {
        boardStore.setState({
            id,
            CRDT: yBoard,
        });
    };

    yBoard.observeDeep(handler);
    detach = () => yBoard.unobserveDeep(handler);
}

/* -------------------------------------------------------------------------- */
/*                                   PUBLIC API                               */
/* -------------------------------------------------------------------------- */

export const setBoardId = (id: string) => {
    syncToCRDT(id);
};

/* -------------------------------------------------------------------------- */
/*                       IMPORTANT: MOUNT DERIVED STORES                       */
/* -------------------------------------------------------------------------- */

// You must mount Deriveds so they react to deps.
lookupDerived.mount();
snapshotDerived.mount();
