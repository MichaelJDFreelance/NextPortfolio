import React, {createContext, CSSProperties, ReactNode} from "react";
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    DragOverlay,
    useDroppable,
    CollisionDetection,
    pointerWithin,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {BoardUpdateAction, NewColumnDef, PathToString, useBoard} from "@/hooks/useBoard";

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}

type CardProps<T> = {
    item: T;
    activeId: string;
    showAnyway?: boolean;
    render: (item: T) => React.ReactNode;
    classNames?: BoardClassNames;
};

export const ColumnContext = createContext<ColumnProps<any> | null>(null);
export const CardContext = createContext<CardProps<any> | null>(null);

function Card<T extends { id: string }>({
                                            item,
                                            activeId,
                                            showAnyway = false,
                                            render,
                                            classNames,
                                        }: CardProps<T>) {
    const id = item?.id;

    const { setNodeRef, transform, transition, attributes, listeners } =
        useSortable({ id });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: id === activeId && !showAnyway ? 0 : 1,
        pointerEvents: id === activeId && !showAnyway ? "none" : undefined,
    };

    return (
        <CardContext.Provider
            value={{
                item,
                activeId,
                showAnyway,
                render,
            }}
        >
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className={cn(
                    "rounded-lg bg-white shadow-sm p-3 mb-2 cursor-grab transition-opacity",
                    classNames?.card
                )}
            >
                {render(item)}
            </div>
        </CardContext.Provider>
    );
}

type ColumnProps<TItem> = {
    id: string;
    title: string;
    items: TItem[];
    activeCard: { id: string } | null;
    renderCard: (item: TItem) => React.ReactNode;
    classNames?: BoardClassNames;
    style: CSSProperties;
    isPreviewColumn?: boolean;
};

function Column<TItem>({
                           id,
                           title,
                           items,
                           activeCard,
                           renderCard,
                           classNames,
                           style,
                           isPreviewColumn,
                       }: ColumnProps<TItem>) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <ColumnContext.Provider
            value={{
                id,
                title,
                items,
                activeCard,
                renderCard,
                style,
            }}
        >
            <div
                ref={setNodeRef}
                className={cn(
                    "bg-muted p-4 rounded-xl w-64 flex flex-col",
                    classNames?.column
                )}
                style={style as CSSProperties}
            >
                <h3
                    className={cn(
                        "text-sm font-semibold text-muted-foreground mb-2",
                        classNames?.columnTitle
                    )}
                >
                    {title} {isPreviewColumn && "Preview"}
                </h3>
                <SortableContext
                    items={items.map((item: any) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {(items as any[])
                        .sort((a, b) => a.order - b.order)
                        .map((item: any) => (
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
    [K in keyof T]: T[K] extends any[] ? K : never;
}[keyof T] &
    string;

type ItemFromField<T, K extends keyof T> = T[K] extends (infer U)[] ? U : never;

type RequiresItemWithIdAndOrder<T, K extends keyof T> =
    ItemFromField<T, K> extends { id: string; order: number }
        ? unknown
        : ["Error: itemsField must point to array of { id: string; order: number }"];

type BoardProps<
    TColumn extends { id: string; order: number } & Record<string, unknown>,
    TItemsField extends PathToArray<TColumn>,
    TNameField extends PathToString<TColumn>
> = RequiresItemWithIdAndOrder<TColumn, TItemsField> & {
    columns: Record<string, TColumn>;
    onUpdate: (updated: BoardUpdateAction<TColumn, any>) => void;
    itemsField: TItemsField;
    nameField: TNameField;
    children: (item: ItemFromField<TColumn, TItemsField>) => React.ReactNode;
    classNames?: BoardClassNames;
    newColumnDef?:NewColumnDef
};

// Compose pointer-within → closest-center
const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
        return pointerCollisions;
    }
    return closestCenter(args);
};

type BoardClassNames = {
    board?: string;
    column?: string;
    columnTitle?: string;
    card?: string;
    overlayCard?: string;
};

export default function Board<
    TColumn extends { id: string; order: number } & Record<string, unknown>,
    TItemsField extends PathToArray<TColumn>,
    TNameField extends PathToString<TColumn>
>({
      columns,
      onUpdate,
      itemsField,
      nameField,
      children,
      classNames,
      newColumnDef
  }: BoardProps<TColumn, TItemsField, TNameField>) {
    const { dndContextProps, renderColumns, activeCard, activeColumn } = useBoard(
        {
            columns,
            onUpdate,
            itemsField,
            nameField,
            newColumnDef
        }
    );

    type TItem = ItemFromField<TColumn, TItemsField> & {
        id: string;
        order: number;
        isPreviewColumn?: boolean;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const previewColumn = {
        [nameField]: "New",
        [itemsField]: [],
    } as unknown as TColumn;

    if (!columns) {
        return <>Loading</>;
    }

    const newColumnId = newColumnDef?.id??"new-column-preview";

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetection}
            {...dndContextProps}
        >
            <div
                className={cn("flex gap-6 overflow-x-auto p-4 w-fit", classNames?.board)}
            >
                <SortableContext
                    items={Object.values(columns).sort((a,b)=>a.order-b.order).map(c => {
                       return c.id;
                    })}
                    strategy={horizontalListSortingStrategy}
                >

                    {[...Object.values(renderColumns), ...((!!newColumnDef)?[{
                        ...previewColumn,
                        id: newColumnId,
                        order: Infinity
                    } ]:[])]
                        .sort((a, b) => a.order - b.order)
                        .map((column) => {
                            const isNewColumn = column.id === newColumnId;
                            const title = isNewColumn
                                ? "New"
                                : (column[nameField] as string) ?? "Unnamed";
                            const items = isNewColumn
                                ? []
                                : ((column[itemsField] as unknown) as TItem[]) ?? [];

                            return (
                                <SortableColumn<TItem>
                                    key={column.id}
                                    id={column.id}
                                    title={title}
                                    items={items}
                                    activeCard={activeCard}
                                    renderCard={children}
                                    classNames={classNames}
                                    isPreviewColumn={isNewColumn}
                                    style={{
                                        height: "100%",
                                        visibility:
                                            activeColumn && column.id === activeColumn.id
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
                    <Column<TItem>
                        id={newColumnId}
                        title={activeColumn[nameField] as string}
                        items={(activeColumn[itemsField] as unknown) as TItem[]}
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

function SortableColumn<TItem>(props: ColumnProps<TItem> & { isPreviewColumn?: boolean }) {
    const { setNodeRef, transform, transition, attributes, listeners } =
        useSortable({
            id: props.id,
            disabled: props.isPreviewColumn,
        });

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

