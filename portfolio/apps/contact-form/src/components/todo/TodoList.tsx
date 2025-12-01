"use client";

import { useStore } from "@tanstack/react-store";
import { removeCompleted, TODO, todoStore } from "@/lib/todo/todoStore";
import { Todo } from "@/components/todo/Todo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Fragment, useState } from "react";

import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const filters = {
    all: (todo: TODO) => true,
    active: (todo: TODO) => !todo.done,
    completed: (todo: TODO) => todo.done,
};

export function TodoList() {
    const [filter, setFilter] = useState<keyof typeof filters>("all");

    const todos = useStore(todoStore);
    const todosComplete = useStore(todoStore, (todos) =>
        todos.filter((t) => !t.done)
    );

    const filtered = todos.filter(filters[filter]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = todos.findIndex((t) => t.id === active.id);
            const newIndex = todos.findIndex((t) => t.id === over.id);
            todoStore.setState(arrayMove(todos, oldIndex, newIndex));
        }
    };

    return (
        <div className="flex flex-col todo-list dark:todo-list-dark w-full max-w-[540px] dark-theme:bg-25273D">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filtered.map((t) => t.id!)} strategy={verticalListSortingStrategy}>
                    {filtered.map((todo) => (
                        <Fragment key={todo.id}>
                            <SortableTodo id={todo.id!} />
                            <hr />
                        </Fragment>
                    ))}
                </SortableContext>
            </DndContext>

            <div className="flex items-center justify-between w-full max-w-[540px] py-4 px-6">
                <span>{todosComplete.length} items left</span>
                <RadioGroup
                    onValueChange={(value) => setFilter(value as keyof typeof filters)}
                    className="flex items-center gap-5"
                >
                    <label>
                        <RadioGroupItem className="hidden" value={"all"} />All
                    </label>
                    <label>
                        <RadioGroupItem className="hidden" value={"active"} />
                        Active
                    </label>
                    <label>
                        <RadioGroupItem className="hidden" value={"completed"} />
                        Completed
                    </label>
                </RadioGroup>
                <button onClick={removeCompleted}>Clear Completed</button>
            </div>
        </div>
    );
}

// Sortable wrapper around your existing <Todo /> component
function SortableTodo({ id }: { id: string }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Todo id={id} />
        </div>
    );
}