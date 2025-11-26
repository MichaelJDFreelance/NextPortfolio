import { Store } from "@tanstack/react-store";
import { getBoardById } from "@/lib/yjs/accessors";
import * as Y from "yjs";

type BoardSnapshot = {
    name: string;
    columns: {
        id: string;
        name: string;
        tasks: {
            id: string;
            title: string;
            completed: boolean;
            subtasks: any[];
        }[];
    }[];
};

type BoardLookup = {
    columnsById: Map<string, any>;
    tasksById: Map<string, any>;
};

type BoardStore = {
    id?: string;
    CRDT?: any;
    snapshot?: BoardSnapshot;
    lookup?: BoardLookup;
};

export const boardStore = new Store<BoardStore | undefined>(undefined);

// Build snapshot + lookup together (single pass)
function computeBoardState(yBoard: any) {
    const columns = yBoard.get("columns").toArray();
    const columnsById = new Map<string, any>();
    const tasksById = new Map<string, any>();

    const snapshot = {
        name: yBoard.get("name"),
        columns: columns.map((col: any) => {
            columnsById.set(col.get("id"), col);

            // 🔐 Safely get tasks as a Y.Array
            let yTasks = col.get("tasks") as Y.Array<any> | undefined;
            if (!(yTasks instanceof Y.Array)) {
                // optional: repair the CRDT structure on the fly
                yTasks = new Y.Array();
                col.set("tasks", yTasks);
            }

            const tasks = yTasks.toArray();

            return {
                id: col.get("id"),
                name: col.get("name"),
                tasks: tasks.map((task: any) => {
                    tasksById.set(task.get("id"), task);

                    // same idea for subtasks
                    let ySubs = task.get("subtasks") as Y.Array<any> | undefined;
                    if (!(ySubs instanceof Y.Array)) {
                        ySubs = new Y.Array();
                        task.set("subtasks", ySubs);
                    }

                    return {
                        id: task.get("id"),
                        title: task.get("title"),
                        completed: task.get("completed"),
                        subtasks: ySubs.toArray(),
                    };
                }),
            };
        }),
    };

    return { snapshot, lookup: { columnsById, tasksById } };
}

let detach: (() => void) | null = null;

// Called whenever ID changes OR CRDT changes
function syncToCRDT(id: string | undefined) {
    if (!id) return;

    const yBoard = getBoardById(id);
    if (!yBoard) return;

    const { snapshot, lookup } = computeBoardState(yBoard);

    boardStore.setState({
        id,
        CRDT: yBoard,
        snapshot,
        lookup
    });

    if (detach) detach();

    const handler = () => {
        const { snapshot, lookup } = computeBoardState(yBoard);
        boardStore.setState({
            id,
            CRDT: yBoard,
            snapshot,
            lookup
        });
    };

    yBoard.observeDeep(handler);
    detach = () => yBoard.unobserveDeep(handler);
}

// Update the ID and sync immediately
export const setBoardId = (id: string) => {
    syncToCRDT(id);
};