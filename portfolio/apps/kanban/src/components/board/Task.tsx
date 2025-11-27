"use client";

import { useStore } from "@tanstack/react-store";
import { boardStore, snapshotDerived, lookupDerived } from "@/lib/store/boardStore";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

type TaskProps = {
    id: string;
    columnId: string;
    index: number;
};

export function Task({ id, columnId, index }: TaskProps) {
    // 1. Core board state (only { id, CRDT })
    const core = useStore(boardStore);

    // 2. Derived snapshot + lookup
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    const yBoard = core?.CRDT;

    /* ──────────────────────────────────────────────
     *  MAKE TASK SORTABLE
     * ────────────────────────────────────────────── */
    const sortableId = `${id}`;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: sortableId,
        data: {
            type: "task",
            taskId: id,
            columnId,
            index,
        },
    });

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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col py-5 px-4 gap-2 bg-white rounded shadow cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            <h2 className="text-preset-heading-m">{taskSnap.title}</h2>
            <span>
                {completedCount} of {taskSnap.subtasks.length} subtasks
            </span>
        </div>
    );
}
