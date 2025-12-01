// dndStore.ts
import { Store } from "@tanstack/react-store";

export interface DndState {
    activeTaskId: string | null;
    shadowColumns: Record<string, string[]>; // columnId -> taskIds
}

export const dndStore = new Store<DndState>({
    activeTaskId: null,
    shadowColumns: {},
});

// Convenient helpers
export const resetDndState = () => {
    dndStore.setState({
        activeTaskId: null,
        shadowColumns: {},
    });
};