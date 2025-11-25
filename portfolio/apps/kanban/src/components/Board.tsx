"use client"

import {useBoardById, useColumnById, useTaskById} from "@/hooks/useKanbanLookup";
import {useYArray, useYMap} from "@/hooks/useYSubscriptions";
import * as Y from "yjs";
import {useYDoc} from "@/components/yjs/YProvider";
import {useMoveTask} from "@/hooks/useKanbanMutation";
import {getKanbanRoot} from "@/lib/kanbanRoot";
import {getBoardById, getColumnById, getTaskById} from "@/lib/kanbanLookup";

type TaskProps = { id: string; column: any; board: Y.Map<any> }
type ColumnProps = { id: string; board: Y.Map<any> }
type BoardProps = { id: string; }

export function Task({ id, column, board }:TaskProps) {
    const task = useTaskById(column, id);
    const moveTask = useMoveTask();

    // Always call hooks
    const taskData = useYMap(task);
    const subtasksArray = task?.get("subtasks") ?? null;
    const subtasks = useYArray(subtasksArray);
    const doc = useYDoc();

    // UI guard (allowed)
    if (!task) return null;

    const completedCount = subtasks.filter((s: any) => s.get("completed")).length;

    function renameTask() {
        const newName = prompt("Enter new task name");
        if (!newName || !column || !task) return;

        doc.transact(() => {
            task.set("title", newName); // or "name" depending on your seed
        });
    }

    const moveRight = () => {
        const root = getKanbanRoot(doc);

        const liveBoard = getBoardById(root, board.get("id"));
        if (!liveBoard) return;

        const liveColumn = getColumnById(liveBoard, column.get("id"));
        if (!liveColumn) return;

        const liveTask = getTaskById(liveColumn, id);
        if (!liveTask) return;

        const allColumns = liveBoard.get("columns") as Y.Array<Y.Map<any>>;

        let fromIndex = 0;
        for (let i = 0; i < allColumns.length; i++) {
            if (allColumns.get(i) === liveColumn) {
                fromIndex = i;
                break;
            }
        }

        const toCol = allColumns.get(fromIndex + 1);
        if (!toCol) return;

        moveTask(liveTask, liveColumn, toCol, 0);
    };

    return (
        <div className="flex flex-col py-5 px-4 rounded gap-2">
            <h2 className="text-preset-heading-m">{taskData.title}</h2>
            <button onClick={renameTask} className={`cursor-pointer`}>Rename</button>
            <button onClick={moveRight} className={`cursor-pointer`}>Move Right</button>
            <span className="text-preset-heading-m">
        {completedCount} of {subtasks.length} subtasks
      </span>
        </div>
    );
}

export function Column({ id, board }: ColumnProps) {
    const column = useColumnById(board, id);
    const doc = useYDoc();

    const colData = useYMap(column);
    const tasksArray = column?.get("tasks");
    const tasks = useYArray(tasksArray);

    if (!column || !tasks) return null;

    function renameColumn() {
        const newName = prompt("Enter new column name");
        if (!newName || !column) return;

        doc.transact(() => {
            column.set("name", newName); // or "name" depending on your seed
        });
    }

    return (
        <div className="column flex flex-col gap-6">
            <h2>{colData.name}</h2>
            <button onClick={renameColumn} className={`cursor-pointer`}>Rename</button>
            <div className="tasks flex flex-col gap-5">
                {tasks.map((t) => (
                    <Task id={(t as any).get("id")} board={board} column={column} key={(t as any).get("id")} />
                ))}
            </div>
        </div>
    );
}

export function Board({ id }: BoardProps) {
    const board = useBoardById(id);        // ← hook (must always run)
    const doc = useYDoc();

    const columnsArray =
        board && board.doc
            ? (board.get("columns") as Y.Array<any>)
            : null;                        // ← safe input to hook

    const columns = useYArray(columnsArray);   // ← hook (always runs)

    // After hooks → UI guard
    if (!board) return null;

    function renameBoard() {
        const newName = prompt("Enter new board name");

        if (board && newName) {
            doc.transact(() => {
                board.set("name", newName);
            });
        }
    }

    return (
        <div className="board flex gap-6">
            <button onClick={renameBoard} className={`cursor-pointer`}>Rename</button>
            {columns.map((c) => (
                <Column
                    key={c.get("id")}
                    id={c.get("id")}
                    board={board}
                />
            ))}
        </div>
    );
}