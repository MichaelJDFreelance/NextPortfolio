"use client"

import * as Y from "yjs";
import {moveColumn, moveTask} from "@/lib/yjs/mutators";
import {useStore} from "@tanstack/react-store";
import {boardStore} from "@/lib/store/boardStore";
import {DragEndEvent} from "@dnd-kit/core/dist/types/events";
import {DndContext} from "@dnd-kit/core";
import {horizontalListSortingStrategy,SortableContext} from "@dnd-kit/sortable";
import {Column} from "@/components/Column";
import {AddColumnModal} from "@/components/modals/AddColumnModal";
import {columnModal} from "@/lib/store/modalStore";

export function Board() {
    const state = useStore(boardStore);
    if (!state) return null;

    const { snapshot, lookup, CRDT: yBoard } = state;
    if (!snapshot || !lookup) return null;

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeData = active.data.current as any;
        const overData = over.data.current as any;
        if (!activeData || !overData) return;

        // 🧱 COLUMN DRAG
        if (activeData.type === "column" && overData.type === "column") {
            const fromIndex = activeData.index as number;
            const toIndex = overData.index as number;
            if (fromIndex === toIndex) return;

            const state = boardStore.state;
            const yBoard = state?.CRDT as Y.Map<any> | undefined;
            if (!yBoard) return;

            moveColumn(yBoard, fromIndex, toIndex);
            return;
        }

        // 🔥 TASK DRAG
        if (activeData.type === "task" && overData.type === "task") {
            const taskId = String(active.id);
            const fromColumnId = String(activeData.columnId);
            const toColumnId = String(overData.columnId);
            const newIndex = overData.index as number | undefined;

            if (!fromColumnId || !toColumnId || newIndex == null) return;
            if (fromColumnId === toColumnId && active.id === over.id) return;

            const state = boardStore.state;
            const lookup = state?.lookup;
            if (!lookup) return;

            const yTask = lookup.tasksById.get(taskId) as Y.Map<any> | undefined;
            const fromCol = lookup.columnsById.get(fromColumnId) as Y.Map<any> | undefined;
            const toCol = lookup.columnsById.get(toColumnId) as Y.Map<any> | undefined;

            if (!yTask || !fromCol || !toCol) return;

            moveTask(yTask, fromCol, toCol, newIndex);
            return;
        }
    }

    const columnIds = snapshot.columns.map((c) => c.id);

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <button onClick={()=>columnModal.setState({open:true, board:yBoard})}>Add Column</button>
            <SortableContext
                items={columnIds}
                strategy={horizontalListSortingStrategy}
            >
                <div className="board flex gap-6">

                    {snapshot?.columns.map((c, index) => (
                        <Column key={c.id} id={c.id} index={index}/>
                    ))}
                </div>
            </SortableContext>
            <AddColumnModal />
        </DndContext>
    );
}