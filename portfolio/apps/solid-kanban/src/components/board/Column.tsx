"use client";

import { useStore } from "@tanstack/solid-store";
import { boardStore, snapshotDerived, lookupDerived, } from "@/lib/store/boardStore";
import { Task } from "@/components/board/Task";
//import {dndStore} from "@/lib/store/dndStore";
import {uiService} from "@/lib/store/uiMachine";
import {createColumnDnd, createTaskDropTarget} from "@/lib/ui/kanbanUtils";
import {DropIndicator} from "@/components/DropIndicator";

type ColumnProps = { id: string; index: number };

export function Column({ id, index }: ColumnProps) {
    // Core board state
    const core = useStore(boardStore);
    //const shadow = useStore(dndStore, s=>s.shadowColumns)

    let columnEl: HTMLDivElement | null = null;
    let headerEl: HTMLDivElement | null = null;
    let tasksEl: HTMLDivElement | null = null;

    const {closestEdge} = createColumnDnd({
        columnId: id,
        columnRef: () => columnEl,
        headerRef: () => headerEl,
        onColumnDrop: payload => uiService.send({ type: "DROP_COLUMN", event: payload }),
        onDragStart: () => uiService.send({ type: "START_DRAG", event: {} })
    });

    createTaskDropTarget({
        columnId: id,
        tasksRef: () => tasksEl,
        onTaskDrop: payload => uiService.send({ type: "DROP_TASK", event: payload })
    });

    // Derived snapshot + lookup
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    if (!core) return null;

    if (!snapshot || !lookup) return null;

    // Column UI snapshot
    const colSnap = snapshot()?.columns?.find((c:any) => c.id === id);
    if (!colSnap) return null;

    // CRDT reference
    const yColumn = lookup()?.columnsById.get(id);
    if (!yColumn) return null;

    //const taskIds = colSnap.tasks.map((t) => t.id);
    //const hasProjection = shadow && Object.keys(shadow).length > 0;
    const taskIds =
        /*hasProjection
        ? shadow[id] ?? []     // projection order
        : */
        colSnap.tasks.map((t:any) => t.id) // real order

    return (
        <div
            ref={el => (columnEl = el)}
            class="flex flex-col gap-4 min-w-[280px]"
        >
            <h2 ref={el => (headerEl = el)}>{colSnap.name}</h2>

                <div class="tasks flex flex-col gap-5 relative"
                     ref={el => (tasksEl = el)}
                     data-type="kanban-task-container"
                     data-column-id={id}>
                    {taskIds.map((taskId:any, idx:any) => (
                        <Task id={taskId} index={idx} columnId={id} />
                    ))}
                    {/* Atlassian-like indicator */}
                    {closestEdge && (
                        <DropIndicator edge={closestEdge()!} gap="8px" />
                    )}
                </div>

        </div>
    );
}
