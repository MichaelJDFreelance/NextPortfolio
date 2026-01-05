"use client";

import { useStore } from "@tanstack/solid-store";
import { boardStore, snapshotDerived, lookupDerived } from "@/lib/store/boardStore";
import {uiService} from "@/lib/store/uiMachine";
import {createTaskDnd} from "@/lib/ui/kanbanUtils";
import {DropIndicator} from "@/components/DropIndicator";
import {createMemo, Show} from "solid-js";
import {Portal} from "solid-js/web";

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

    const options  = {
        taskId:id, columnId:()=>columnId,
    onDragStart: ()=>uiService.send({type:"START_DRAG", event:{}})
    }

    const { ref, closestEdge, state } = createTaskDnd(options);

    const yBoard = (core())?.CRDT;

    if (!core() || !yBoard) return null;

    if (!(snapshot()) || !lookup) return null;

    // 3. Extract the UI snapshot of this task
    const colSnap = (snapshot())?.columns.find((c:any) => c.id === columnId);
    if (!colSnap) return null;

    const taskSnap = colSnap.tasks.find((t:any) => t.id === id);
    if (!taskSnap) return null;

    // 4. CRDT references
    const yTask = lookup()?.tasksById.get(id);
    const yColumn = lookup()?.columnsById.get(columnId);

    if (!yTask || !yColumn) return null;

    const completedCount = taskSnap.subtasks.filter((s:any) => s.completed).length;

    const previewState = createMemo(() =>
        state().type === "preview" ? state() : null
    );

    const s = previewState();
    const isPreview = s?.type === "preview";

    return (
        <>
            <div
                ref={ref}
                data-task-id={id}
                data-column-id={columnId}
                class={`relative`}
            >
                <h2 class="text-preset-heading-m">{taskSnap.title}</h2>
                <span>
                    {completedCount} of {taskSnap.subtasks.length} subtasks
                        {closestEdge && (
                            <DropIndicator edge={closestEdge()!} />
                        )}
                </span>
            </div>

            {isPreview && (
                <Portal mount={(s as Extract<any, { type: "preview" }>).container}>
                    <div
                        style={{
                            width: `${(s as any).rect.width}px`,
                            height: `${(s as any).rect.height}px`,
                            "pointer-events": "none",
                        }}
                    >
                        ...
                    </div>
                </Portal>
            )}
        </>
    );
}
