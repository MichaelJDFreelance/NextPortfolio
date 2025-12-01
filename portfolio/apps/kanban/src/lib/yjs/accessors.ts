import {getBoardsArray} from "@/lib/yjs/yDoc";

export function getBoardById(id: string) {
    try {
        const arr = getBoardsArray();
        for (let i = 0; i < arr.length; i++) {
            const board = arr.get(i);        // THIS is the real Y.Map instance
            if (board.get("id") === id) {
                return board;
            }
        }
        return null;
    } catch {
        return null;
    }
}