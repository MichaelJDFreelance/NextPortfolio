"use client";

import { useYDoc } from "@/components/yjs/YProvider";
import { useYArray } from "@/hooks/useYSubscriptions";
import { getKanbanRoot } from "@/lib/kanbanRoot";
import * as Y from "yjs";

export const useBoards = () => {
    const doc = useYDoc();
    const root = getKanbanRoot(doc);

    // provider guarantees this exists before rendering
    const boardsArray = root.get("boards") as Y.Array<Y.Map<any>>;

    return useYArray(boardsArray);
};