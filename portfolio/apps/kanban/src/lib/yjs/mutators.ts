import * as Y from "yjs";
import {doc} from "@/lib/yjs/yDoc";

export function moveTask(
    yBoard: Y.Map<any>,
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number
) {
    doc.transact(() => {
        const columns = yBoard.get("columns") as Y.Map<any>;
        const tasks = yBoard.get("tasks") as Y.Map<any>;

        if (!(columns instanceof Y.Map)) return;
        if (!(tasks instanceof Y.Map)) return;

        const fromCol = columns.get(fromColumnId);
        const toCol = columns.get(toColumnId);
        if (!fromCol || !toCol) return;

        const fromArr = fromCol.get("taskOrder") as Y.Array<string>;
        const toArr = toCol.get("taskOrder") as Y.Array<string>;

        if (!(fromArr instanceof Y.Array)) return;
        if (!(toArr instanceof Y.Array)) return;
        if (!tasks.get(taskId)) return; // task must exist

        // Remove from old column
        const oldIndex = fromArr.toArray().indexOf(taskId);
        if (oldIndex === -1) return;

        fromArr.delete(oldIndex);

        // Insert into new column
        const safeIndex = Math.min(Math.max(newIndex, 0), toArr.length);
        toArr.insert(safeIndex, [taskId]);
    });
}

export function moveColumn(
    yBoard: Y.Map<any>,
    fromIndex: number,
    toIndex: number
) {
    doc.transact(() => {
        const columnOrder = yBoard.get("columnOrder") as Y.Array<string>;
        if (!(columnOrder instanceof Y.Array)) return;

        const arr = columnOrder.toArray();
        if (
            fromIndex < 0 ||
            fromIndex >= arr.length ||
            toIndex < 0 ||
            toIndex >= arr.length
        ) {
            return;
        }

        if (fromIndex === toIndex) return;

        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);

        // Replace entire array (Yjs applies minimal diff)
        columnOrder.delete(0, columnOrder.length);
        columnOrder.insert(0, arr);
    });
}

export function addColumn(yBoard: Y.Map<any>, name: string) {
    doc.transact(() => {
        const columns = yBoard.get("columns") as Y.Map<any>;
        const columnOrder = yBoard.get("columnOrder") as Y.Array<string>;

        if (!(columns instanceof Y.Map)) return;
        if (!(columnOrder instanceof Y.Array)) return;

        const id = crypto.randomUUID();

        const colMap = new Y.Map<any>();
        colMap.set("id", id);
        colMap.set("name", name);
        colMap.set("taskOrder", new Y.Array<string>());

        columns.set(id, colMap);
        columnOrder.push([id]);
    });
}

export function addTask(
    yBoard: Y.Map<any>,
    columnId: string,
    title: string
) {
    doc.transact(() => {
        const columns = yBoard.get("columns") as Y.Map<any>;
        const tasks = yBoard.get("tasks") as Y.Map<any>;
        if (!(columns instanceof Y.Map) || !(tasks instanceof Y.Map)) return;

        const col = columns.get(columnId);
        if (!col) return;

        const taskOrder = col.get("taskOrder") as Y.Array<string>;
        if (!(taskOrder instanceof Y.Array)) return;

        const taskId = crypto.randomUUID();

        const task = new Y.Map();
        task.set("id", taskId);
        task.set("title", title);
        task.set("description", "");
        task.set("status", col.get("name"));  // or empty
        task.set("subtasks", new Y.Array());

        tasks.set(taskId, task);
        taskOrder.push([taskId]);
    });
}