import {getBoardsArray} from "@/lib/yjs/yDoc";

export function getBoardById(id: string) {
    const arr = getBoardsArray().toArray();

    return arr.find((b) => {
        const v = b.get("id");
        return String(v) === String(id);
    });
}