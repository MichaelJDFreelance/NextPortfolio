"use client";

import { useStore } from "@tanstack/react-store";
import { getBoardsArray } from "@/lib/yjs/yDoc";
import {setBoardId} from "@/lib/store/boardStore";
import * as Y from "yjs";
import {uiStore} from "@/lib/store/uiMachine";

function BoardListItem({ yBoard }: { yBoard: Y.Map<any> }) {// ✔ LEGAL here
    return (
        <div className="border-b pb-4">
            <button onClick={()=>setBoardId(yBoard.get("id").toString())}
                className="cursor-pointer text-preset-heading-l mb-2">
                {yBoard.get("name")}
            </button>
        </div>
    );
}

export function BoardList() {
    const ready = useStore(uiStore, ui=>ui.snapshot?.matches({ app: "ready" }) ?? false);

    if (!ready) return <p>Loading…</p>;

    const boards = getBoardsArray().toArray();

    if (!boards || !(boards?.length)) return <p>No boards found.</p>;

    return (
        <div className="flex flex-col gap-6">
            {boards!.map((b, i) => (
                <BoardListItem key={i} yBoard={b} />
            ))}
        </div>
    );
}