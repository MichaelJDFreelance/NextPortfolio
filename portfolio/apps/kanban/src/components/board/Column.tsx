"use client";

import { useStore } from "@tanstack/react-store";
import { boardStore, snapshotDerived, lookupDerived, } from "@/lib/store/boardStore";
import { Task } from "@/components/board/Task";
import {dndStore} from "@/lib/store/dndStore";
import {useRef} from "react";
import {useColumnDnd, useTaskDropTarget} from "@/components/genericBoard/useKanbanColumn";
import {uiService} from "@/lib/store/uiMachine";
import {DropIndicator} from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

type ColumnProps = { id: string; index: number };

export function Column({ id, index }: ColumnProps) {
    // Core board state
    const core = useStore(boardStore);
    const shadow = useStore(dndStore, s=>s.shadowColumns)

    const columnRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const tasksRef = useRef<HTMLDivElement>(null);

    const { closestEdge } = useColumnDnd(
        id,
        columnRef,
        headerRef,
        (payload)=>uiService.send({type:"DROP_COLUMN", event:payload}),
        ()=>uiService.send({type:"START_DRAG", event:{}})
    );

    useTaskDropTarget(id, tasksRef, (payload)=>uiService.send({type:"DROP_TASK", event:payload}))


    // Derived snapshot + lookup
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    if (!core) return null;

    if (!snapshot || !lookup) return null;

    // Column UI snapshot
    const colSnap = snapshot.columns.find((c) => c.id === id);
    if (!colSnap) return null;

    // CRDT reference
    const yColumn = lookup.columnsById.get(id);
    if (!yColumn) return null;

    //const taskIds = colSnap.tasks.map((t) => t.id);
    const hasProjection = shadow && Object.keys(shadow).length > 0;
    const taskIds = hasProjection
        ? shadow[id] ?? []     // projection order
        : colSnap.tasks.map(t => t.id) // real order

    return (
        <div
            ref={columnRef}
            className="flex flex-col gap-4 min-w-[280px]"
        >
            <h2 ref={headerRef}>{colSnap.name}</h2>

                <div className="tasks flex flex-col gap-5 relative"
                     ref={tasksRef}
                     data-type="kanban-task-container"
                     data-column={id}>
                    {taskIds.map((taskId, idx) => (
                        <Task key={taskId} id={taskId} index={idx} columnId={id} />
                    ))}
                    {/* Atlassian-like indicator */}
                    {closestEdge && (
                        <DropIndicator edge={closestEdge} gap="8px" />
                    )}
                </div>

        </div>
    );
}
