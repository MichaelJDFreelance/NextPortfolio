"use client";

import { useStore } from "@tanstack/react-store";
import {boardsReady, boardsVersion} from "@/lib/store/boardsVersion";
import { getBoardsArray } from "@/lib/yjs/yDoc";
import {setBoardId} from "@/lib/store/boardStore";
import * as Y from "yjs";

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
    const version = useStore(boardsVersion);

    const ready = useStore(boardsReady);

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