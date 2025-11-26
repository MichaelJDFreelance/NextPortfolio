import {useStore} from "@tanstack/react-store";
import {boardStore} from "@/lib/store/boardStore";
import { CSS } from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";

type TaskProps = { id: string; columnId: string; index: number; }

export function Task({ id, columnId, index }: TaskProps) {

    const state = useStore(boardStore);
    if (!state) return null;

    const { snapshot, lookup, CRDT: yBoard } = state;

    const columnSnap = snapshot?.columns.find(c => c.id === columnId);
    if (!columnSnap) return null;

    const taskSnap = columnSnap.tasks.find(t => t.id === id);
    if (!taskSnap) return null;

    // CRDT references
    const yTask = lookup?.tasksById.get(id);
    const yColumn = lookup?.columnsById.get(columnId);

    if (!yTask || !yColumn || !yBoard) return null;

    const completedCount = taskSnap.subtasks.filter(s => s.completed).length;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id, // dnd-kit item id
        data: {
            type: "task",
            taskId: id,
            columnId,
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
            className="flex flex-col py-5 px-4 gap-2 bg-white rounded shadow cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            <h2 className="text-preset-heading-m">{taskSnap.title}</h2>

            <span>{completedCount} of {taskSnap.subtasks.length} subtasks</span>
        </div>
    );
}