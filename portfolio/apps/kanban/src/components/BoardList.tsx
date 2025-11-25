"use client";

import { useBoards } from "@/hooks/useBoards";
import {activeBoardStore} from "@/lib/store/activeBoardStore";
import {useYMap} from "@/hooks/useYSubscriptions";

export function BoardList() {
    const boards = useBoards();

    if (!boards.length) {
        return <p className="opacity-60 p-4">No boards found.</p>;
    }

    return (
        <div className="flex flex-col gap-6">
            {boards.map((b, i) => {
                const boardData = useYMap(b);

                return (
                    <div key={`${boardData.id}-${i}`} className="border-b pb-4">
                        <button onClick={()=>activeBoardStore.setState(()=>boardData.id)}
                                className="cursor-pointer text-preset-heading-l mb-2">
                            {boardData.name}</button>
                    </div>
                );
            })}
        </div>
    );
}