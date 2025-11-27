"use client";

import { useStore } from "@tanstack/react-store";
import { boardStore, snapshotDerived, lookupDerived } from "@/lib/store/boardStore";
import { DragEndEvent } from "@dnd-kit/core/dist/types/events";
import {DndContext, DragStartEvent} from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { AddColumnModal } from "@/components/modals/AddColumnModal";
import { uiStore, uiService } from "@/lib/store/uiMachine";
import {Column} from "@/components/board/Column";

export function Board() {
    const ui = useStore(uiStore);

    // 1. ALL HOOKS MUST RUN UNCONDITIONALLY
    const core = useStore(boardStore);
    const snapshot = useStore(snapshotDerived);
    const lookup = useStore(lookupDerived);

    // 2. NOW we can safely bail out
    if (!core || !core.CRDT) return <div className="loading">Loading…</div>;
    //if (!snapshot || !lookup) return <div className="loading">Loading…</div>;
    const uiReady = ui.snapshot?.matches({ app: "ready" }) ?? false;
    if (!uiReady) return <div className="loading">Loading…</div>;

    const yBoard = core.CRDT;

    function handleDragStart(event: DragStartEvent) {
        uiService.send({ type: "START_DRAG", event });
    }

    function handleDragEnd(event: DragEndEvent) {
        const activeType = event.active.data.current?.type;

        console.log("ACTIVE DATA:", event.active.data.current);
        console.log("OVER DATA:", event.over?.data.current);

        if (activeType === "task") {
            uiService.send({ type: "DROP_TASK", event });
        } else if (activeType === "column") {
            uiService.send({ type: "DROP_COLUMN", event });
        } else {
            // Nice to have fallback:
            uiService.send({ type: "CANCEL_DRAG" });
        }
    }

    const columnIds = snapshot!.columns.map((c) => c.id);

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
           {/* <button onClick={() => columnModal.setState({ open: true, board: yBoard })}>
                Add Column
            </button>*/}

            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
                <div className="board flex isolate">
                    {snapshot!.columns.map((c, index) => (
                        <Column key={c.id} id={c.id} index={index} />
                    ))}
                </div>
            </SortableContext>

            {/*<AddColumnModal />*/}
        </DndContext>
    );
}
