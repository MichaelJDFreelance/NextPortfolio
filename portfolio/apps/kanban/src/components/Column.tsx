import {useStore} from "@tanstack/react-store";
import {boardStore} from "@/lib/store/boardStore";
import {SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Task} from "@/components/Task";

type ColumnProps = { id: string; index: number; }

export function Column({ id, index }: ColumnProps) {
    const state = useStore(boardStore);
    if (!state) return null;

    const { snapshot, lookup } = state;

    const colSnap = snapshot?.columns.find(c => c.id === id);
    if (!colSnap) return null;

    const yColumn = lookup?.columnsById.get(id);
    if (!yColumn) return null;

    const taskIds = colSnap.tasks.map((t) => t.id);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id, // column id
        data: {
            type: "column",
            columnId: id,
            index,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col gap-4 min-w-[280px]" // make columns nice and card-like
            {...attributes}
            {...listeners}
        >
            <h2>{colSnap.name}</h2>

            <SortableContext
                items={taskIds}
                strategy={verticalListSortingStrategy}
            >
                <div className="tasks flex flex-col gap-5">
                    {colSnap.tasks.map((t, index) => (
                        <Task index={index} key={t.id} id={t.id} columnId={id} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}