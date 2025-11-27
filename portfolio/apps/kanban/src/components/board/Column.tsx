"use client";

import { useStore } from "@tanstack/react-store";
import {
    boardStore,
    snapshotDerived,
    lookupDerived,
} from "@/lib/store/boardStore";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/components/board/Task";

type ColumnProps = { id: string; index: number };

export function Column({ id, index }: ColumnProps) {
    // Core board state
    const core = useStore(boardStore);


    // Derived snapshot + lookup
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    /* ──────────────────────────────────────────────
     * MAKE COLUMN SORTABLE
     * ────────────────────────────────────────────── */
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id, // MUST remain pure ID
        data: {
            type: "column",
            columnId: id,
            index,
        },
    });

    if (!core) return null;

    if (!snapshot || !lookup) return null;

    // Column UI snapshot
    const colSnap = snapshot.columns.find((c) => c.id === id);
    if (!colSnap) return null;

    // CRDT reference
    const yColumn = lookup.columnsById.get(id);
    if (!yColumn) return null;

    const taskIds = colSnap.tasks.map((t) => t.id);



    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    /* IMPORTANT FIX:
     * SortableContext.items MUST be pure IDs
     * to match useSortable({ id: taskId })
     */
    const sortableTaskIds = taskIds;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col gap-4 min-w-[280px]"
            {...attributes}
            {...listeners}
        >
            <h2>{colSnap.name}</h2>

            {/* TASK LIST SORTABLE CONTEXT */}
            <SortableContext items={sortableTaskIds} strategy={verticalListSortingStrategy}>
                <div className="tasks flex flex-col gap-5">
                    {colSnap.tasks.map((t, idx) => (
                        <Task key={t.id} id={t.id} index={idx} columnId={id} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}
