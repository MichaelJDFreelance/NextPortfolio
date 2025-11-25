import * as Y from "yjs";
import { useYDoc } from "@/components/yjs/YProvider";

export function useMoveTask() {
    const doc = useYDoc();

    return (
        task: Y.Map<any>,
        fromColumn: Y.Map<any>,
        toColumn: Y.Map<any>,
        newIndex: number
    ) => {
        doc.transact(() => {
            const fromArr = fromColumn.get("tasks") as Y.Array<Y.Map<any>>;
            const toArr = toColumn.get("tasks") as Y.Array<Y.Map<any>>;

            const oldIndex = fromArr.toArray().indexOf(task);
            if (oldIndex !== -1) {
                fromArr.delete(oldIndex, 1);
            }

            console.log("toArr", toArr)

            toArr.insert(newIndex, [task]);
        });
    };
}