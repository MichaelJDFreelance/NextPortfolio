// /lib/dnd/handleDragOverStable.ts
import { dndStore } from "@/lib/store/dndStore";
import {computeProjectedColumns} from "@/lib/store/uiMachine";

let lastShadow: Record<string, string[]> | null = null;

export function handleDragOverStable(event, lookup) {
    const activeId = event.active?.id;
    const overId = event.over?.id;
    const toColumn =
        event.over?.data?.current?.columnId ??
        lookup.columnForTask.get(overId);

    if (!activeId || !overId || !toColumn) return;

    const prev = lastShadow ?? dndStore.state.shadowColumns;

    const next = computeProjectedColumns(prev, lookup, activeId, overId, toColumn);

    if (shallowEqualRecord(prev, next)) {
        return; // 🛑 stops infinite loop
    }

    lastShadow = next;

    dndStore.setState({
        activeTaskId: activeId,
        shadowColumns: next,
    });
}

export function shallowEqualRecord(a, b) {
    if (a === b) return true;
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) return false;
    for (const k of ak) {
        const av = a[k];
        const bv = b[k];
        if (av.length !== bv.length) return false;
        for (let i = 0; i < av.length; i++) {
            if (av[i] !== bv[i]) return false;
        }
    }
    return true;
}
