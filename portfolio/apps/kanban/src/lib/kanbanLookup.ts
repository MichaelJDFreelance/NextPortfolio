import * as Y from "yjs";

export function getBoardById(root: Y.Map<any>, id: string) {
    const boards = root.get("boards") as Y.Array<Y.Map<any>>;
    for (const board of boards) {
        if (board.get("id") === id) return board;
    }
    return null;
}

export function getColumnById(board: Y.Map<any>, id: string) {
    const columns = board.get("columns") as Y.Array<Y.Map<any>>;
    for (const col of columns) {
        if (col.get("id") === id) return col;
    }
    return null;
}

export function getTaskById(column: Y.Map<any>, id: string) {
    const tasks = column.get("tasks") as Y.Array<Y.Map<any>>;
    for (const task of tasks) {
        if (task.get("id") === id) return task;
    }
    return null;
}