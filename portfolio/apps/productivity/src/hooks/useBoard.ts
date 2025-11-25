// useBoard.ts (refactored to use Record<string, TColumn>)
import {useState, useEffect, useRef, ReactNode, CSSProperties} from "react";
import { arrayMove } from "@dnd-kit/sortable";

export type NewColumnDef = { onDropTask: (oldColumnId: string, newColumnId: string, taskId: string, onCommit: (id:string)=>void, onCancel: ()=>void) => void,
    classNames?:Record<string, CSSProperties>, component?:ReactNode, id?:string }

export type BoardUpdateAction<TColumn, TItem> =
    | { type: "REORDER_COLUMNS"; order: string[] }
    | { type: "REORDER_TASKS"; columnId: string; tasks: TItem[] }
    | { type: "MOVE_TASK"; sourceId: string; targetId: string; tasks: { [columnId: string]: TItem[] } }
    | { type: "MOVE_CARD_TO_NEW_COLUMN"; sourceId: string; targetId: string; tasks: { [columnId: string]: TItem[] } }
    | { type: "ADD_COLUMN"; column: any; tasks: { [columnId: string]: TItem[] } }
    | { type: "ADD_TASK"; task: TItem }
    | { type: "EDIT_TASK"; task: TItem }

export type PathToValue<T, V, Prev extends string = ''> = {
    [K in keyof T]: T[K] extends V
        ? `${Prev}${K & string}` // Match
        : T[K] extends object
            ? PathToValue<T[K], V, `${Prev}${K & string}.`> // Recurse
            : never
}[keyof T];
export type PathToString<T> = PathToValue<T, string>;

type ItemFromField<T, K extends keyof T> = T[K] extends (infer U)[] ? U : never;

export type UseBoardOptions<
    TColumn extends { id: string; order: number },
    TItemsField extends keyof TColumn
> = {
    columns: Record<string, TColumn>;
    onUpdate: (updated: BoardUpdateAction<TColumn, any>) => void;
    itemsField: TItemsField;
    nameField: PathToString<TColumn>;
    newColumnDef?: NewColumnDef;
};

export function useBoard<
    TColumn extends { id: string; order: number },
    TItemsField extends keyof TColumn
>(
    options: UseBoardOptions<TColumn, TItemsField>
) {
    type TItem = ItemFromField<TColumn, TItemsField> & { id: string; order: number };

    const { columns, onUpdate, itemsField, newColumnDef } = options;

    const lastOverIdRef = useRef<string | null>(null);
    const [activeCard, setActiveCard] = useState<TItem | null>(null);
    const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
    const [tempColumns, setTempColumns] = useState<Record<string, TColumn>>(columns);
    const [dragOrigin, setDragOrigin] = useState<string | null>(null);

    const getTs = (column: TColumn): TItem[] => column[itemsField] as TItem[];

    useEffect(() => {
        if (!activeCard?.id) {
            setTempColumns(columns);
        }
    }, [columns, activeCard?.id]);

    const getColumnContaining = (
        id: string,
        source: Record<string, TColumn> = tempColumns
    ): TColumn | undefined =>
        Object.values(source).find(col =>
            getTs(col).some(item => item.id === id)
        );

    const isColumnId = (id: string): boolean =>
        Boolean(columns[id]);

    // --- Drag handlers ---
    const handleDragStart = ({ active }: { active: any }) => {
        if (isColumnId(active.id)) {
            setActiveColumn(columns[active.id]);
            return;
        }

        lastOverIdRef.current = null;
        const origin = getColumnContaining(active.id, columns);
        if (!origin) return;

        const realItem = getTs(origin).find(i => i.id === active.id)!;
        setActiveCard(realItem);
        setDragOrigin(origin.id);
    };

    const handleDragCancel = () => {
        lastOverIdRef.current = null;
        setActiveCard(null);
        setActiveColumn(null);
        setTempColumns(columns);
    };

    const handleDragOver = ({ active, over }: { active: any; over: any }) => {
        if (!over || active.id === over.id) return;
        // Only handle each over.id once
        if (lastOverIdRef.current === over.id) return;
        lastOverIdRef.current = over.id;

        const sourceCol = getColumnContaining(active.id, tempColumns);
        const targetCol = getColumnContaining(over.id, tempColumns);
        if (!sourceCol || !targetCol) return;

        const sourceId = sourceCol.id;
        const targetId = targetCol.id;
        if (sourceId === targetId) return;

        const sourceItems = [...getTs(sourceCol)];
        const targetItems = [...getTs(targetCol)];

        const sourceIndex = sourceItems.findIndex(i => i.id === active.id);
        const overIndex = targetItems.findIndex(i => i.id === over.id);
        const insertAt = overIndex >= 0 ? overIndex : targetItems.length;

        const [moved] = sourceItems.splice(sourceIndex, 1);
        const dup = targetItems.findIndex(i => i.id === moved.id);
        if (dup !== -1) targetItems.splice(dup, 1);
        targetItems.splice(insertAt, 0, moved);

        const srcChanged = (getTs(tempColumns[sourceId]) as TItem[])
            .map(i => i.id)
            .join() !== sourceItems.map(i => i.id).join();
        const tgtChanged = (getTs(tempColumns[targetId]) as TItem[])
            .map(i => i.id)
            .join() !== targetItems.map(i => i.id).join();

        if (srcChanged || tgtChanged) {
            setTempColumns({
                ...tempColumns,
                [sourceId]: { ...sourceCol, [itemsField]: sourceItems },
                [targetId]: { ...targetCol,   [itemsField]: targetItems },
            });
        }
    };

    const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
        console.log("over", over)
        console.log("active", active)
        console.log("dragOrigin", dragOrigin)
        if (!over) return;

        if (newColumnDef && dragOrigin && over.id === "new-column-preview") {
            newColumnDef.onDropTask(
                dragOrigin,
                active.id,
                over.id,
                // ✅ Commit callback
                (targetColId:string) => {
                    const sourceCol = columns[dragOrigin];
                    const targetCol = columns[over.id];
                    if (!sourceCol || !targetCol) return;

                    const sourceItems = [...getTs(sourceCol)];
                    const targetItems = [...getTs(targetCol)];

                    const sourceIndex = sourceItems.findIndex(i => i.id === active.id);
                    if (sourceIndex === -1) return;

                    onUpdate({
                        type: "MOVE_CARD_TO_NEW_COLUMN",
                        sourceId: sourceCol.id,
                        targetId: targetColId,
                        tasks: {
                            [sourceCol.id]: sourceItems.map((t, idx) => ({ ...t, order: idx })),
                            [targetColId]: targetItems.map((t, idx) => ({ ...t, order: idx })),
                        },
                    });

                    setDragOrigin(null);
                    setActiveCard(null);
                },
                // ❌ Cancel callback
                () => {
                    setDragOrigin(null);
                    setActiveCard(null);
                }
            );
            return;
        }

        setActiveColumn(null);
        lastOverIdRef.current = null;
        setActiveCard(null);

        // 🟢 CASE 1: Reorder columns
        if (isColumnId(active.id) && isColumnId(over.id)) {
            const ids = Object.values(columns).sort((a, b) => a.order - b.order).map(c => c.id);

            const oldIndex = ids.indexOf(active.id);
            const newIndex = ids.indexOf(over.id);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const reordered = arrayMove(ids, oldIndex, newIndex);
                onUpdate({
                    type: "REORDER_COLUMNS",
                    order: reordered,
                });
            }

            setDragOrigin(null);
            return;
        }

        if (!dragOrigin) return;

        const sourceCol = columns[dragOrigin];
        const targetCol = isColumnId(over.id)
            ? columns[over.id]
            : getColumnContaining(over.id, columns);

        if (!sourceCol || !targetCol) return;

        const sourceItems = [...getTs(sourceCol)];
        const targetItems = [...getTs(targetCol)];

        const sourceIndex = sourceItems.findIndex(i => i.id === active.id);
        if (sourceIndex === -1) return;

        const overIndex = targetItems.findIndex(i => i.id === over.id);
        const insertAt = overIndex >= 0 ? overIndex : targetItems.length;

        if (sourceCol.id === targetCol.id) {
            // 🔄 Reorder within same column
            const reordered = arrayMove(sourceItems, sourceIndex, insertAt)
                .map((item, i) => ({ ...item, order: i }));

            onUpdate({
                type: "REORDER_TASKS",
                columnId: sourceCol.id,
                tasks: reordered,
            });
        } else {
            // 📦 Move across columns
            const [movedItem] = sourceItems.splice(sourceIndex, 1);
            targetItems.splice(insertAt, 0, movedItem);

            const normalizedSource = sourceItems.map((i, idx) => ({ ...i, order: idx }));
            const normalizedTarget = targetItems.map((i, idx) => ({ ...i, order: idx }));

            onUpdate({
                type: "MOVE_TASK",
                sourceId: sourceCol.id,
                targetId: targetCol.id,
                tasks: {
                    [sourceCol.id]: normalizedSource,
                    [targetCol.id]: normalizedTarget,
                },
            });
        }

        setDragOrigin(null);
    };

    return {
        dndContextProps: {
            onDragStart: handleDragStart,
            onDragOver: handleDragOver,
            onDragEnd: handleDragEnd,
            onDragCancel: handleDragCancel,
        },
        renderColumns: activeCard?.id ? tempColumns : columns,
        activeCard,
        activeColumn,
    };
}
