"use client"

import modal from "@/lib/ModalReducer";
import {useState} from "react";
import {useStore} from "@tanstack/react-store";
import {useForm} from "@tanstack/react-form";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {Task} from "@/store/boardStore";
import {activeBoardStore} from "@/store/activeStore";
import {columnOrderStore} from "@/store/coloumnStore";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";

function SortableItem({ id, index, field, form }: any) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2 flex items-center gap-2">
            {/* Drag handle */}
            <div {...attributes} {...listeners} className="cursor-move p-2">
                ☰
            </div>
            {/* Input field outside of drag listeners */}
            <form.Field name={`columns[${index}].name`}>
                {(subField: any) => (
                    <input
                        value={subField.state.value}
                        onChange={(e) => {
                            console.log('New value:', e.target.value);
                            subField.setValue(e.target.value);
                        }}
                        className="w-full p-2 border rounded"
                    />
                )}
            </form.Field>
        </div>
    );
}


export function EditBoardModal() {
    const [card, setCard] = useState<Task|null>(null);
    modal.listen({current:"kanban-board", op:"edit"}, setCard)

    const selectedBoard = useStore(activeBoardStore);
    const columns = useStore(columnOrderStore, (order) => selectedBoard ? order[selectedBoard] : []);

    // Initial values for form (column names)
    const form = useForm({
        defaultValues: {
            columns: columns.map((col) => ({ id: col, name: col })),
        },
        onSubmit: async ({ value }) => {
            // Handle save logic here, like updating state or sending to a backend
            console.log("Updated column names:", value.columns);
            columnOrderStore.setState((prev)=>
            ({...prev, [selectedBoard!]: value.columns.map((col:any) => col.name)}));
            modal.close();
        },
    });

    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <Dialog open={!!card} onOpenChange={() => modal.close()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit {selectedBoard}</DialogTitle>
                    <DialogDescription>Edit column names</DialogDescription>
                </DialogHeader>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}>
                    <form.Field name="columns" mode="array">
                        {(field) => (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={({ active, over }) => {
                                    if (active.id !== over?.id) {
                                        const oldIndex = field.state.value.findIndex((i) => i.id === active.id);
                                        const newIndex = field.state.value.findIndex((i) => i.id === over?.id);
                                        const newOrder = arrayMove(field.state.value, oldIndex, newIndex);
                                        field.setValue(newOrder);
                                    }
                                }}
                            >
                                <SortableContext
                                    items={field.state.value.map((item) => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {field.state.value.map((item, index) => (
                                        <SortableItem key={item.id} id={item.id} index={index} field={field} form={form} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </form.Field>
                    <button type="submit" className="mt-4">Save Changes</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}