import * as Y from "yjs";
import {doc} from "@/lib/yjs/yDoc";

export function moveTask(task: Y.Map<any>, fromColumn: Y.Map<any>, toColumn: Y.Map<any>, newIndex: number) {
    doc.transact(() => {
        const fromArr = fromColumn.get("tasks") as Y.Array<any>;
        const toArr = toColumn.get("tasks") as Y.Array<any>;

        // find index BEFORE deleting anything
        let oldIndex = -1;
        for (let i = 0; i < fromArr.length; i++) {
            if (fromArr.get(i) === task) {
                oldIndex = i;
                break;
            }
        }

        if (oldIndex === -1) return;

        // Clone BEFORE deleting
        const json = task.toJSON();
        const clone = cloneTask(task)

        // Remove original
        fromArr.delete(oldIndex);

        // Insert clone
        toArr.insert(newIndex, [clone]);
    });
}

function cloneTask(task: Y.Map<any>) {
    const t = new Y.Map();

    t.set("id", crypto.randomUUID()); // tasks should get new IDs
    t.set("title", task.get("title"));
    t.set("completed", task.get("completed"));

    // clone subtasks
    const subArr = new Y.Array();
    const originalSubs = task.get("subtasks");

    if (originalSubs instanceof Y.Array) {
        originalSubs.toArray().forEach(sub => {
            const newSub = new Y.Map();
            newSub.set("id", crypto.randomUUID());
            newSub.set("title", sub.get("title"));
            newSub.set("completed", sub.get("completed"));
            subArr.push([newSub]);
        });
    }

    t.set("subtasks", subArr);

    return t;
}

export function moveColumn(
    yBoard: Y.Map<any>,
    fromIndex: number,
    toIndex: number
) {
    const cols = yBoard.get("columns") as Y.Array<any> | undefined;
    if (!(cols instanceof Y.Array)) return;

    const len = cols.length;
    if (fromIndex < 0 || fromIndex >= len) return;

    // clamp target index
    if (toIndex < 0) toIndex = 0;
    if (toIndex >= len) toIndex = len - 1;

    if (fromIndex === toIndex) return;

    // 1) Snapshot columns as JSON
    const colsJson = cols.toArray().map((c: any) => c.toJSON());

    // 2) Reorder JSON
    const [moved] = colsJson.splice(fromIndex, 1);
    colsJson.splice(toIndex, 0, moved);

    // 3) Build fresh Yjs structures
    const newCols = new Y.Array<Y.Map<any>>();

    for (const colJson of colsJson) {
        const colMap = new Y.Map<any>();
        colMap.set("id", colJson.id);
        colMap.set("name", colJson.name);

        const tasksArray = new Y.Array<Y.Map<any>>();
        colMap.set("tasks", tasksArray);

        for (const taskJson of colJson.tasks ?? []) {
            const taskMap = new Y.Map<any>();
            taskMap.set("id", taskJson.id);
            taskMap.set("title", taskJson.title);
            taskMap.set("description", taskJson.description ?? "");
            taskMap.set("completed", taskJson.completed ?? false);

            const subtasksArray = new Y.Array<Y.Map<any>>();
            taskMap.set("subtasks", subtasksArray);

            for (const subJson of taskJson.subtasks ?? []) {
                const sm = new Y.Map<any>();
                sm.set("id", subJson.id);
                sm.set("title", subJson.title);
                sm.set("isCompleted", subJson.isCompleted ?? subJson.completed ?? false);
                subtasksArray.push([sm]);
            }

            tasksArray.push([taskMap]);
        }

        newCols.push([colMap]);
    }

    // 4) Replace the columns array on the board
    yBoard.set("columns", newCols);
}

export function addColumn(yBoard: Y.Map<any>, name: string) {
    doc.transact(() => {
        const cols = yBoard.get("columns") as Y.Array<any> | undefined;
        if (!(cols instanceof Y.Array)) return;

        const colMap = new Y.Map<any>();
        colMap.set("id", crypto.randomUUID());
        colMap.set("name", name);

        const tasksArray = new Y.Array<Y.Map<any>>();
        colMap.set("tasks", tasksArray);

        cols.push([colMap]);
    });
}

export function addTaskToColumn(yColumn: Y.Map<any>, title: string) {
    doc.transact(() => {
        const tasksArray = yColumn.get("tasks") as Y.Array<any> | undefined;
        if (!(tasksArray instanceof Y.Array)) return;

        const taskMap = new Y.Map<any>();
        taskMap.set("id", crypto.randomUUID());
        taskMap.set("title", title);
        taskMap.set("description", "");
        taskMap.set("completed", false);

        const subtasksArray = new Y.Array<Y.Map<any>>();
        taskMap.set("subtasks", subtasksArray);

        tasksArray.push([taskMap]);
    });
}