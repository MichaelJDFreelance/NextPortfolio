import React, {createContext, CSSProperties, useEffect} from "react";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    DragOverlay, useDroppable, CollisionDetection, pointerWithin,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";

// utils/cn.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {useBoard} from "@/hooks/useBoard";

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

type CardProps<T> = {
    item: T;
    activeId: string;
    showAnyway?: boolean;
    render: (item: T) => React.ReactNode;
    classNames?: BoardClassNames;
}

export const ColumnContext = createContext<ColumnProps<any> | null>(null);
export const CardContext = createContext<CardProps<any> | null>(null);

function Card<T extends {id:string}>({
                     item,
                     activeId,
                     showAnyway = false,
                     render, classNames
                 }: CardProps<T>) {
    const id = item?.id;

    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
    } = useSortable({ id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: id === activeId && !showAnyway ? 0 : 1,
        pointerEvents: id === activeId && !showAnyway ? "none" : undefined,
    };

    return (
        <CardContext.Provider value={{
            item,
            activeId,
            showAnyway,
            render,
        }}>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}
             className={cn(
                 "rounded-lg bg-white shadow-sm p-3 mb-2 cursor-grab transition-opacity", classNames?.card
             )}>
            {render(item)}
        </div>
        </CardContext.Provider>
    );
}

type ColumnProps<T> = {
    id: string;
    title: string;
    items: T[];
    activeCard: { id:string } | null;
    renderCard: (item: T) => React.ReactNode;
    classNames?: BoardClassNames;
    style: CSSProperties;
    isPreviewColumn?: boolean;
}

function Column<T extends {id:string}>({
                       id,
                       title,
                       items,
                       activeCard,
                       renderCard, classNames, style, isPreviewColumn
                   }: ColumnProps<T>) {
    const { setNodeRef } = useDroppable({ id });


    return (
        <ColumnContext.Provider value={{
            id,
            title,
            items,
            activeCard,
            renderCard,
            style
        }}>
            <div
                ref={setNodeRef}
                className={cn(
                    "bg-muted p-4 rounded-xl w-64 flex flex-col", classNames?.column
                )} style={style as any}
            >
                <h3 className={cn("text-sm font-semibold text-muted-foreground mb-2",
                    classNames?.columnTitle
                )}>{title} {isPreviewColumn && "Preview"}</h3>
                <SortableContext items={items.map((item)=>item.id)} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <Card
                            key={item.id}
                            item={item}
                            activeId={activeCard?.id || ""}
                            render={renderCard}
                            classNames={classNames}
                        />
                    ))}
                </SortableContext>
            </div>
        </ColumnContext.Provider>
    );
}

type PathToArray<T> = {
    [K in keyof T]: T[K] extends any[] ? K : never
}[keyof T] & string;

type PathToString<T> = {
    [K in keyof T]: T[K] extends string ? K : never
}[keyof T] & string;

type ItemFromField<T, K extends keyof T> =
    T[K] extends (infer U)[] ? U : never;

type RequiresItemWithId<T, K extends keyof T> =
    ItemFromField<T, K> extends { id: string } ? unknown :
        ["Error: itemsField must point to array of { id: string }"];

type BoardProps<
    TColumn,
    TItemsField extends keyof TColumn
> = RequiresItemWithId<TColumn, TItemsField> & {
    columns: Record<string, TColumn>;
    onUpdate: (updated: Record<string, TColumn>) => void;
    itemsField: TItemsField;
    nameField: PathToString<TColumn>;
    children: (item: ItemFromField<TColumn, TItemsField>) => React.ReactNode;
    classNames?: BoardClassNames;
    newColumnId?: string; // ← new optional prop
    onAddNewColumn?: (card: any) => void;
    columnOrder: string[];
    setColumnOrder?: (order: string[]) => void;
};

// Compose pointer-within → closest-center
const collisionDetection: CollisionDetection = (args) => {
    // 1) Try high-precision pointer detection…
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
        return pointerCollisions;
    }
    // 2) Otherwise, fall back to closest-center
    return closestCenter(args);
};

type BoardClassNames = {
    board?: string;
    column?: string;
    columnTitle?: string;
    card?: string;
    overlayCard?: string;
};

export default function Board<TColumn,
    TItemsField extends PathToArray<TColumn>>({
                                           columns,
                                           onUpdate,
                                           itemsField,
                                           nameField,
                                           children, classNames, newColumnId="new-column-preview", onAddNewColumn, columnOrder, setColumnOrder
                                       }: BoardProps<TColumn, TItemsField>) {
    const {
        dndContextProps,
        renderColumns,
        activeCard,
        activeColumn,
    } = useBoard({
        columns,
        onUpdate,
        itemsField,
        nameField,
        onAddNewColumn,
        columnOrder,
        setColumnOrder
    });

    useEffect(() => {
        if (columns) {
            const columnKeys = Object.keys(columns);
            const invalidKeys = columnOrder.filter((id) => !columnKeys.includes(id));

            if (invalidKeys.length > 0) {
                console.warn(
                    `[Board] columnOrder contains unknown column keys: ${invalidKeys.join(", ")}`
                );
            }
        }
    }, [columnOrder, columns]);

    type TItem = (TColumn[typeof itemsField] extends (infer U)[] ? U : never) & { id: string; isPreviewColumn?: boolean };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const useNewColumn = !!onAddNewColumn;
    const boardColumns = useNewColumn ? [...columnOrder, newColumnId] : columnOrder;

    // Optionally ensure renderColumns has a placeholder for preview column
    const previewColumn = {
        [nameField]: "New",
        [itemsField]: [],
    } as unknown as TColumn;

    const mergedColumns = useNewColumn
        ? { ...renderColumns, [newColumnId]: previewColumn }
        : renderColumns;

    const activeColumnId = Object.keys(mergedColumns).find(
        (id) => mergedColumns[id] === activeColumn
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            {...dndContextProps}
        >
            <div className={cn("flex gap-6 overflow-x-auto p-4 w-fit", classNames?.board)}>
                <SortableContext
                    items={boardColumns}
                    strategy={horizontalListSortingStrategy}
                >
                    {boardColumns.map((columnId) => {
                        const isNewColumn = columnId === newColumnId;
                        const col = mergedColumns[columnId];

                        const title = isNewColumn
                            ? "New"
                            : (col?.[nameField] as string) ?? "Unnamed";

                        const items = isNewColumn
                            ? []
                            : (col?.[itemsField] as TItem[]) ?? [];

                        return (
                            <SortableColumn<TItem>
                                key={columnId}
                                id={columnId}
                                title={title}
                                items={items}
                                activeCard={activeCard}
                                renderCard={children}
                                classNames={classNames}
                                isPreviewColumn={columnId === newColumnId}
                                style={{
                                    height: "100%",
                                    visibility:
                                        activeColumn &&
                                        columnId === activeColumnId
                                            ? "hidden"
                                            : "visible",
                                }}
                            />
                        );
                    })}
                </SortableContext>
            </div>

            <DragOverlay>
                {activeCard ? (
                    <Card<TItem>
                        item={activeCard}
                        activeId={activeCard.id}
                        showAnyway={true}
                        render={children}
                        classNames={classNames}
                    />
                ) : activeColumn ? (
                    <Column
                        id={newColumnId}
                        title={activeColumn[nameField] as string}
                        items={activeColumn[itemsField] as any[]}
                        activeCard={activeCard}
                        renderCard={children}
                        classNames={classNames}
                        style={{}}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function SortableColumn<T extends { id: string }>(props: ColumnProps<T> & { isPreviewColumn?: boolean }) {
    const {
        setNodeRef,
        transform,
        transition,
        attributes,
        listeners,
    } = useSortable({ id: props.id, disabled: props.isPreviewColumn, });  // ← pass this in as a prop

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Column {...props} />
        </div>
    );
}
