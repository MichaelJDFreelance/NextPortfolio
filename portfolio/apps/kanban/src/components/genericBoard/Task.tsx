// Task.tsx
"use client";

import {Id} from "@/components/genericBoard/types";
import {useTaskDnd} from "@/components/genericBoard/useKanbanColumn";
import {DropIndicator} from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {createPortal} from "react-dom";

type TaskModel = {
    id: Id;
    title: string;
};

export function Task({ task, columnId }: { task: TaskModel; columnId: Id }) {
    const { ref, closestEdge, state } = useTaskDnd(task.id, columnId);

    return (
        <>
            <div
                ref={ref}
                data-task-id={task.id}
                data-column-id={columnId}
                className="
                    border bg-white rounded-[8px]
                    min-h-[40px] px-2 py-1
                    shadow-sm transition-all relative
                "
            >
                {task.title}

                {closestEdge && (
                    <DropIndicator edge={closestEdge} />
                )}
            </div>

            {state.type === "preview" &&
                createPortal(
                    <div
                        style={{
                            boxSizing: "border-box",
                            width: state.rect.width,
                            height: state.rect.height,
                        }}
                    >
                        <div
                            data-task-id={task.id}
                            className="
                                border bg-white rounded-[8px]
                                min-h-[40px] px-2 py-1
                                shadow-sm
                            "
                        >
                            {task.title}
                        </div>
                    </div>,
                    state.container
                )}
        </>
    );
}
