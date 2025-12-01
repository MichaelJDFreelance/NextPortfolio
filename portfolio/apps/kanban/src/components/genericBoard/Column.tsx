// Column.tsx
"use client";

import { useRef } from "react";
import { Task } from "./Task";
import {ColumnDropArgs, Id, TaskDropArgs} from "@/components/genericBoard/types";
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import {useColumnDnd, useTaskDropTarget} from "@/components/genericBoard/useKanbanColumn";


type TaskModel = {
    id: Id;
    title: string;
};

type ColumnModel = {
    id: Id;
    title: string;
    taskIds: Id[];
};

export function Column({
                           column,
                           tasks,
                           onTaskDrop,
                           onColumnDrop,
                       }: {
    column: ColumnModel;
    tasks: TaskModel[];
    onTaskDrop: (args: TaskDropArgs) => void;
    onColumnDrop: (args: ColumnDropArgs) => void;
    showIndicator: boolean
}) {
    const columnRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const tasksRef = useRef<HTMLDivElement>(null);

    const { closestEdge } = useColumnDnd(
        column.id,
        columnRef,
        headerRef,
        onColumnDrop
    );

    useTaskDropTarget(column.id, tasksRef, onTaskDrop)

    return (
        <div ref={columnRef} className="relative w-[300px] border rounded ">

            <div
                ref={headerRef}
                className="p-2 bg-gray-200 rounded-t font-medium cursor-grab"
            >
                {column.title}
            </div>
            <div
                ref={tasksRef}
                data-type="kanban-task-container"
                data-column={column.id}
                className="p-2 flex flex-col gap-2 min-h-[60px] pb-[200px] bg-slate-50 h-full"
            >
                {tasks.map((task) => (
                    <div key={task.id} className="relative">
                        {/*{beforeTaskId === task.id && (
                            <div className="h-2 bg-blue-400 rounded mb-1" />
                        )}*/}
                        <Task task={task} columnId={column.id} />
                    </div>
                ))}
                {/* Atlassian-like indicator */}
                {closestEdge && (
                    <DropIndicator edge={closestEdge} gap="8px" />
                )}
            </div>
        </div>
    );
}
