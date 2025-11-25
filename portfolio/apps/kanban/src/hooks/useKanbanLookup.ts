"use client";

import * as Y from "yjs";
import {useYDoc} from "@/components/yjs/YProvider";
import {getKanbanRoot} from "@/lib/kanbanRoot";

export const useBoardById = (id: string): Y.Map<any> | null => {
    const doc = useYDoc();
    const root = getKanbanRoot(doc);

    const boards = root.get("boards") as Y.Array<Y.Map<any>>;

    for (const board of boards) {
        if (board.get("id") === id) return board;
    }

    return null;
};

export const useColumnById = (board: Y.Map<any>, id: string): Y.Map<any> | null => {
    const columns = board.get("columns") as Y.Array<Y.Map<any>>;
    for (const col of columns) {
        if (col.get("id") === id) return col;
    }
    return null;
};

export const useTaskById = (column: Y.Map<any>, id: string): Y.Map<any> | null => {
    const tasks = column.get("tasks") as Y.Array<Y.Map<any>>;
    for (const task of tasks) {
        if (task.get("id") === id) return task;
    }
    return null;
};
