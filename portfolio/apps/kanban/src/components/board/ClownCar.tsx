import { useState } from "react";
import {
    DndContext,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = { id: string; title: string };
type Column = { id: string; title: string; taskIds: string[] };

type DndState = {
    activeTaskId: string | null;
    shadowColumns: Record<string, string[]>;
};

const initialColumns: Column[] = [
    { id: "col-1", title: "Todo", taskIds: ["t-1", "t-2"] },
    { id: "col-2", title: "Doing", taskIds: ["t-3"] },
];

const initialTasks: Record<string, Task> = {
    "t-1": { id: "t-1", title: "First" },
    "t-2": { id: "t-2", title: "Second" },
    "t-3": { id: "t-3", title: "Third" },
};

export default function MiniBoard() {
    const [columns, setColumns] = useState<Column[]>(initialColumns);
    const [tasks] = useState(initialTasks);
    const [dnd, setDnd] = useState<DndState>({
        activeTaskId: null,
        shadowColumns: {},
    });

    const columnIds = columns.map((c) => c.id);

    function buildShadow(): Record<string, string[]> {
        return Object.fromEntries(columns.map((c) => [c.id, [...c.taskIds]]));
    }

    function projectShadow(
        state: DndState,
        activeId: string,
        overId: string,
        toColumnId: string
    ): Record<string, string[]> | null {
        const base =
            Object.keys(state.shadowColumns).length > 0
                ? state.shadowColumns
                : buildShadow();

        const current = base[toColumnId] ?? [];
        const overIndex = current.indexOf(overId);
        const activeIndex = current.indexOf(activeId);

        if (overIndex === activeIndex) return null;

        const shadow: Record<string, string[]> = {};
        for (const [colId, ids] of Object.entries(base)) {
            shadow[colId] = ids.filter((id) => id !== activeId);
        }

        const list = shadow[toColumnId] ?? [];
        const insertIndex = overIndex === -1 ? list.length : overIndex;
        list.splice(insertIndex, 0, activeId);
        shadow[toColumnId] = list;

        return shadow;
    }

    function handleDragStart(e: DragStartEvent) {
        const type = e.active.data.current?.type;
        if (type !== "task") return;

        setDnd({
            activeTaskId: String(e.active.id),
            shadowColumns: buildShadow(),
        });
    }

    function handleDragOver(e: DragOverEvent) {
        const { active, over } = e;
        if (!active || !over) return;

        const aData = active.data.current;
        const oData = over.data.current;
        if (!aData || aData.type !== "task") return;
        if (!oData || oData.type !== "task") return;

        const activeId = String(active.id);
        const overId = String(over.id);
        const toColumnId = oData.columnId;
        if (!toColumnId) return;

        setDnd((prev) => {
            const next = projectShadow(prev, activeId, overId, toColumnId);
            if (!next) return prev;
            return { ...prev, shadowColumns: next };
        });
    }

    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;

        setDnd({
            activeTaskId: null,
            shadowColumns: {},
        });

        if (!over) return;
        const aData = active.data.current;
        const oData = over.data.current;
        if (!aData || aData.type !== "task") return;
        if (!oData || oData.type !== "task") return;

        const fromColId = aData.columnId as string;
        const toColId = oData.columnId as string;
        const overIndex = oData.index as number;

        if (!toColId) return;

        setColumns((prev) => {
            const map = new Map(prev.map((c) => [c.id, { ...c }]));

            const from = map.get(fromColId)!;
            const to = map.get(toColId)!;

            from.taskIds = from.taskIds.filter((id) => id !== active.id);
            const insertIndex =
                fromColId === toColId
                    ? overIndex
                    : Math.min(overIndex, to.taskIds.length);
            to.taskIds = [
                ...to.taskIds.slice(0, insertIndex),
                String(active.id),
                ...to.taskIds.slice(insertIndex),
            ];

            return Array.from(map.values());
        });
    }

    const effectiveColumns = columns.map((col) => {
        const shadowList = dnd.shadowColumns[col.id];
        return {
            ...col,
            taskIds: dnd.activeTaskId && shadowList ? shadowList : col.taskIds,
        };
    });

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div style={{ display: "flex", gap: 16 }}>
                    {effectiveColumns.map((col) => (
                        <div
                            key={col.id}
                            style={{
                                minWidth: 240,
                                padding: 8,
                                border: "1px solid #ccc",
                                borderRadius: 8,
                            }}
                        >
                            <h3>{col.title}</h3>
                            <SortableContext
                                items={col.taskIds}
                                strategy={verticalListSortingStrategy}
                            >
                                {col.taskIds.map((id, index) => (
                                    <TaskCard
                                        key={id}
                                        id={id}
                                        index={index}
                                        columnId={col.id}
                                        title={tasks[id].title}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function TaskCard({
                      id,
                      title,
                      index,
                      columnId,
                  }: {
    id: string;
    title: string;
    index: number;
    columnId: string;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({
            id,
            data: {
                type: "task",
                columnId,
                index,
            },
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: 8,
        marginBottom: 8,
        borderRadius: 6,
        border: "1px solid #ddd",
        background: "#fff",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {title}
        </div>
    );
}