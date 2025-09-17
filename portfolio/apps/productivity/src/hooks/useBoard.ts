// useBoard.ts (hook)
import { useState, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export type PathToValue<T, V, Prev extends string = ''> = {
    [K in keyof T]: T[K] extends V
        ? `${Prev}${K & string}` // Match
        : T[K] extends object
            ? PathToValue<T[K], V, `${Prev}${K & string}.`> // Recurse
            : never
}[keyof T];
export type PathToString<T> = PathToValue<T, string>;

type ItemFromField<T, K extends keyof T> = T[K] extends (infer U)[] ? U : never;

type RequiresItemWithId<T, K extends keyof T> =
    ItemFromField<T, K> extends { id: string } ? unknown :
        ["Error: itemsField must point to array of { id: string }"];

export type UseBoardOptions<
    TColumn,
    TItemsField extends keyof TColumn
> = {
    columns: Record<string, TColumn>;
    onUpdate: (updated: Record<string, TColumn>) => void;
    itemsField: TItemsField;
    nameField: PathToString<TColumn>;
    onAddNewColumn?: (item: any) => void;
    columnOrder: string[];
    setColumnOrder?: (order: string[]) => void;
};

// derive TItem safely
//type TItemsField = typeof options.itemsField;

//const { columns, onUpdate, itemsField, nameField } = options;

export function useBoard<TColumn, TItemsField extends keyof TColumn>(
    options: UseBoardOptions<TColumn, TItemsField>
) {


    type TItem = ItemFromField<TColumn, TItemsField> & { id: string };

    const { columns, onUpdate, itemsField, onAddNewColumn, columnOrder, setColumnOrder } = options;

    const isColumnId = (id: string): boolean => Object.keys(columns).includes(id);

    // Debounce guard for dragOver
    const lastOverIdRef = useRef<string | null>(null);

    const [activeCard, setActiveCard] = useState<TItem | null>(null);
    const [activeColumn, setActiveColumn] = useState<TColumn | null>(null);
    const [tempColumns, setTempColumns] = useState(columns);
    const [dragOrigin, setDragOrigin] = useState<string | null>(null);

    const getTs = (column: TColumn): TItem[] => column[itemsField] as TItem[];

    useEffect(() => {
        if (!activeCard?.id) {
            setTempColumns(columns);
        }
    }, [columns, activeCard?.id]);

    const getColumnContaining = (id: string, source = tempColumns) =>
        Object.entries(source).find(([, col]) =>
            (getTs(col) as TItem[]).some(item => item.id === id)
        );

    const handleDragStart = ({ active }: { active: any }) => {
        if (isColumnId(active.id)) {
            setActiveColumn(columns[active.id]);
            return;
        }
        lastOverIdRef.current = null;
        const origin = getColumnContaining(active.id, columns);
        if (!origin) return;
        const [originColId, originCol] = origin;
        const realItem = (getTs(originCol) as TItem[]).find(i => i.id === active.id)!;
        setActiveCard(realItem);
        setDragOrigin(originColId);
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

        const sourceEntry = getColumnContaining(active.id, tempColumns);
        const targetEntry = getColumnContaining(over.id, tempColumns);
        if (!sourceEntry || !targetEntry) return;

        const [sourceId, sourceCol] = sourceEntry;
        const [targetId, targetCol] = targetEntry;
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
        if (isColumnId(active.id) && isColumnId(over?.id)) {
            const oldIndex = columnOrder.indexOf(active.id);
            const newIndex = columnOrder.indexOf(over.id);

            if (oldIndex !== newIndex && setColumnOrder) {
                setColumnOrder(arrayMove(columnOrder, oldIndex, newIndex));
            }
        }

        setActiveColumn(null);

        lastOverIdRef.current = null;
        setActiveCard(null);
        if (!over || !dragOrigin) return;

        const sourceId = dragOrigin;
        const sourceCol = columns[sourceId];
        const targetResult = getColumnContaining(over.id, tempColumns);
        const targetId = targetResult ? targetResult[0] : over.id;
        const targetCol = targetResult ? targetResult[1] : tempColumns[over.id];

        if (!sourceCol || !targetCol && over.id !== "new-column-preview") return;

        const sourceItems = [...getTs(sourceCol)];
        const sourceIndex = sourceItems.findIndex(i => i.id === active.id);

        // ✅ New column drop behavior
        if (targetId === "new-column-preview") {

            const [movedItem] = sourceItems.splice(sourceIndex, 1);
            if (onAddNewColumn && movedItem) {
                onAddNewColumn(movedItem);
            }
            setActiveCard(null);
            setActiveColumn(null);
            setDragOrigin(null);
            return;
        }


        const targetItems = [...getTs(targetCol)];
        const overIndex = targetItems.findIndex(i => i.id === over.id);
        const insertAt = overIndex >= 0 ? overIndex : targetItems.length;

        if (sourceId === targetId) {
            const reordered = arrayMove(sourceItems, sourceIndex, insertAt);
            onUpdate({
                ...columns,
                [sourceId]: { ...sourceCol, [itemsField]: reordered },
            });
        } else {
            const [movedItem] = sourceItems.splice(sourceIndex, 1);
            const dup = targetItems.findIndex(i => i.id === movedItem.id);
            if (dup !== -1) targetItems.splice(dup, 1);
            targetItems.splice(insertAt, 0, movedItem);

            onUpdate({
                ...columns,
                [sourceId]: { ...sourceCol, [itemsField]: sourceItems },
                [targetId]: { ...targetCol,   [itemsField]: targetItems },
            });
        }

        setDragOrigin(null);
    };

    return {
        dndContextProps: {
            onDragStart:  handleDragStart,
            onDragOver:   handleDragOver,
            onDragEnd:    handleDragEnd,
            onDragCancel: handleDragCancel,
        },
        renderColumns: activeCard?.id ? tempColumns : columns,
        activeCard,
        activeColumn,
        columnOrder
    };
}