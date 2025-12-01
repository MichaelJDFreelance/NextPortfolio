// Board.tsx
"use client";

import {useState} from "react";
import { KanbanDndProvider } from "./engine";
import { Column } from "./Column";
import {useColumnHoverMonitor} from "@/hooks/useColumnHoverMonitor";
import {Id} from "@/components/genericBoard/types";

type Task = {
    id: Id;
    title: string;
};

type ColumnType = {
    id: Id;
    title: string;
    taskIds: Id[];
};

type BoardState = {
    columns: Record<Id, ColumnType>;
    tasks: Record<Id, Task>;
};

const initialState: BoardState = {
    columns: {
        col1: { id: "col1", title: "Todo", taskIds: ["task1", "task2", "task3"] },
        col2: { id: "col2", title: "Doing", taskIds: [] },
        col3: { id: "col3", title: "Done", taskIds: [] },
    },
    tasks: {
        task1: { id: "task1", title: "Buy milk" },
        task2: { id: "task2", title: "Learn Pragmatic DnD" },
        task3: { id: "task3", title: "Write a blog post" },
    },
};

export function Board() {
    const [state, setState] = useState<BoardState>(initialState);

    const {containerRef, columnHoverId} = useColumnHoverMonitor("kanban-column")
    //const { containerRef, hoverColumnId } = useColumnHover();

    const onColumnDrop = ({
                              columnId,
                              overColumnId,
                          }: {
        columnId: Id;
        overColumnId: Id | null;
    }) => {
        if (!overColumnId || columnId === overColumnId) return;

        setState((prev) => {
            const order = Object.keys(prev.columns);
            const fromIndex = order.indexOf(columnId);
            const toIndex = order.indexOf(overColumnId);
            if (fromIndex === -1 || toIndex === -1) return prev;

            const newOrder = [...order];
            newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, columnId);

            const newColumns: Record<Id, ColumnType> = {};
            newOrder.forEach((id) => {
                newColumns[id] = prev.columns[id];
            });

            return {
                ...prev,
                columns: newColumns,
            };
        });
    };

    const onTaskDrop = ({
                            taskId,
                            fromColumnId,
                            toColumnId,
                            index,
                        }: {
        taskId: Id;
        fromColumnId: Id;
        toColumnId: Id;
        index: number;
    }) => {
        setState(prev => {
            const fromCol = prev.columns[fromColumnId];
            const toCol = prev.columns[toColumnId];

            // remove from old column
            const fromTaskIds = fromCol.taskIds.filter(id => id !== taskId);

            // remove from new column (in case same-column move)
            const toTaskIds = toCol.taskIds.filter(id => id !== taskId);

            // insert at computed index (bounded)
            const safeIndex = Math.min(index, toTaskIds.length);
            toTaskIds.splice(safeIndex, 0, taskId);

            return {
                ...prev,
                columns: {
                    ...prev.columns,
                    [fromColumnId]: { ...fromCol, taskIds: fromTaskIds },
                    [toColumnId]: { ...toCol, taskIds: toTaskIds },
                },
            };
        });
    };

    return (
        <KanbanDndProvider>
            <div ref={containerRef} className="flex gap-4 p-4">
                {Object.values(state.columns).map((col) => (
                    <Column
                        key={col.id}
                        column={col}
                        tasks={col.taskIds.map((id) => state.tasks[id])}
                        onTaskDrop={onTaskDrop}
                        onColumnDrop={onColumnDrop}
                        showIndicator={columnHoverId === col.id}
                    />
                ))}
            </div>
        </KanbanDndProvider>
    );
}
