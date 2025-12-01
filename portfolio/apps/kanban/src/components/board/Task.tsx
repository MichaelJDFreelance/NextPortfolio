"use client";

import { useStore } from "@tanstack/react-store";
import { boardStore, snapshotDerived, lookupDerived } from "@/lib/store/boardStore";
import {DropIndicator} from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {createPortal} from "react-dom";
import {useTaskDnd} from "@/components/genericBoard/useKanbanColumn";
import {uiService} from "@/lib/store/uiMachine";

type TaskProps = {
    id: string;
    columnId: string;
    index: number;
};

export function Task({ id, columnId }: TaskProps) {
    // 1. Core board state (only { id, CRDT })
    const core = useStore(boardStore);

    // 2. Derived snapshot + lookup
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    const { ref, closestEdge, state } = useTaskDnd(id, columnId,
        ()=>uiService.send({type:"START_DRAG", event:{}}));

    const yBoard = core?.CRDT;

    if (!core || !yBoard) return null;

    if (!snapshot || !lookup) return null;

    // 3. Extract the UI snapshot of this task
    const colSnap = snapshot.columns.find((c) => c.id === columnId);
    if (!colSnap) return null;

    const taskSnap = colSnap.tasks.find((t) => t.id === id);
    if (!taskSnap) return null;

    // 4. CRDT references
    const yTask = lookup.tasksById.get(id);
    const yColumn = lookup.columnsById.get(columnId);

    if (!yTask || !yColumn) return null;

    const completedCount = taskSnap.subtasks.filter((s) => s.completed).length;

    return (
        <>
            <div
                ref={ref}
                data-task-id={id}
                data-column-id={columnId}
                className={`relative`}
            >
                <h2 className="text-preset-heading-m">{taskSnap.title}</h2>
                <span>
                    {completedCount} of {taskSnap.subtasks.length} subtasks
                        {closestEdge && (
                            <DropIndicator edge={closestEdge} />
                        )}
                </span>
            </div>

            {state.type === "preview" &&
                createPortal(
                    <div
                        style={{
                            boxSizing: "border-box",
                            width: state.rect.width,
                            height: state.rect.height,
                        }}
                    >
                        <div>
                            <h2 className="text-preset-heading-m">{taskSnap.title}</h2>
                            <span>
                    {completedCount} of {taskSnap.subtasks.length} subtasks
                </span>
                        </div>
                    </div>,
                    state.container
                )}
        </>
    );
}
