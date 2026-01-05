import { DndState } from "@/lib/store/dndStore";

export function updateShadow(
    state: DndState,
    activeId: string,
    overId: string,
    toColumn: string,
    lookup: {
        tasksByColumn: Map<string, string[]>;
        columnForTask: Map<string, string>;
    }
): Record<string, string[]> | null {

    const base = state.shadowColumns;

    const currentList = base[toColumn] ?? lookup.tasksByColumn.get(toColumn);
    if (!currentList) return null;

    const overIndex = currentList.indexOf(overId);
    const activeIndex = currentList.indexOf(activeId);

    // If the active is already in correct place → DO NOTHING
    if (activeIndex === overIndex) {
        return null;       // <—— IMPORTANT
    }

    // Clone for mutation
    const newShadow: Record<string, string[]> = Object.fromEntries(
        [...lookup.tasksByColumn].map(([colId, ids]) => [
            colId,
            [...(base[colId] ?? ids)],
        ])
    );

    // Remove active from all columns
    for (const col in newShadow) {
        newShadow[col] = newShadow[col].filter((id) => id !== activeId);
    }

    const list = newShadow[toColumn];

    const insertIndex = overIndex === -1 ? list.length : overIndex;
    list.splice(insertIndex, 0, activeId);

    return newShadow;
}