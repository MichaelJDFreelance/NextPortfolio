import {supabase} from "@/lib/supabase";
import {Derived, Store} from "@tanstack/react-store";
import {createScopedSubscription} from "@/hooks/useSupabaseSubscription";
import {activeBoardStore} from "@/store/activeStore";

export const supabaseBoardStore = new Store<any>(undefined)

function normalizeListenerValue<T>(value: unknown, prev: T): T {
    return typeof value === 'function' ? (value as (p: T) => T)(prev) : (value as T)
}


supabase.from("KanbanBoards").select().then(({data, error}) => {
    supabaseBoardStore.setState(data);
    if (error) console.error(error);
})

export const supabaseColumnStore = new Store<any>({})

supabase.from("KanbanColumns").select().then(({data, error}) => {
    const sortedData = data?.reduce((acc, column) => {
        if (!acc[column.board_id]) acc[column.board_id] = [];
        acc[column.board_id].push(column);
        return acc;
    }, {} as Record<string, any[]>)
    supabaseColumnStore.setState(sortedData);
    if (error) console.error(error);
})

const columnSubscription = createScopedSubscription<{ boardId: string | null }>(
    (deps) => `columns-for-board-sub-${deps.boardId}`,
    (deps) => ({
        event: "*",
        schema: "public",
        table: "KanbanColumns",
        filter: deps.boardId ? `board_id=eq.${deps.boardId}` : undefined
    }),
    activeBoardStore.state ? { boardId: activeBoardStore.state } : null,
    (payload) => {
        supabaseColumnStore.setState((prev) => {
            // Copy state so we can mutate
            const state = { ...prev };

            switch (payload.eventType) {
                case "INSERT": {
                    const newCol = payload.new;
                    if (!state[newCol.board_id]) state[newCol.board_id] = [];
                    state[newCol.board_id] = [...state[newCol.board_id], newCol];
                    break;
                }

                case "UPDATE": {
                    const updatedCol = payload.new;
                    const boardCols = state[updatedCol.board_id] || [];
                    state[updatedCol.board_id] = boardCols.map((col:any) =>
                        col.id === updatedCol.id ? updatedCol : col
                    );
                    break;
                }

                case "DELETE": {
                    const deletedCol = payload.old;
                    const boardCols = state[deletedCol.board_id] || [];
                    state[deletedCol.board_id] = boardCols.filter(
                        (col:any) => col.id !== deletedCol.id
                    );
                    break;
                }
            }

            return state;
        });
    }
)

activeBoardStore.subscribe((val) => {
    const boardId = normalizeListenerValue<string | null>(val, activeBoardStore.state as any)
    columnSubscription.rescope(boardId ? { boardId } : null)
})

export const supabaseTaskStore = new Store<any>({})

supabase.from("KanbanTasks").select().then(({data, error}) => {
    const sortedData = data?.reduce((acc, task) => {
        if (!acc[task.column_id]) acc[task.column_id] = [];
        acc[task.column_id].push(task);
        return acc;
    }, {} as Record<string, any[]>)
    supabaseTaskStore.setState(sortedData);
    if (error) console.error(error);
})

const taskSubscription = createScopedSubscription<{ columnIds: string[] }>(
    (deps) => `tasks-for-column-subs-${deps.columnIds.join('-')}`,
    (deps) => ({
        event: "*",
        schema: "public",
        table: "KanbanTasks",
        filter: deps.columnIds ? `column_id=in.(${deps.columnIds})` : undefined
    }),
    activeBoardStore.state ? { columnIds: Object.values(supabaseColumnStore.state).flat().map((col:any) => col.id) } : null,
    (payload) => {
        supabaseTaskStore.setState((prev) => {
            // clone the current state so we can mutate safely
            const state = { ...prev };

            console.log("task subscription", payload)

            switch (payload.eventType) {
                case "INSERT": {
                    const newTask = payload.new;
                    if (!state[newTask.column_id]) state[newTask.column_id] = [];
                    state[newTask.column_id] = [...state[newTask.column_id], newTask];
                    break;
                }

                case "UPDATE": {
                    const updatedTask = payload.new;
                    const taskId = payload.old.id; // only guaranteed field

                    // Remove task from every column list
                    for (const colId of Object.keys(state)) {
                        state[colId] = (state[colId] || []).filter((t:any) => t.id !== taskId);
                    }

                    // Insert the updated task into its new column
                    if (!state[updatedTask.column_id]) state[updatedTask.column_id] = [];
                    state[updatedTask.column_id] = [...state[updatedTask.column_id], updatedTask];
                    break;
                }

                case "DELETE": {
                    const deletedTask = payload.old;
                    state[deletedTask.column_id] = (state[deletedTask.column_id] || []).filter(
                        (t:any) => t.id !== deletedTask.id
                    );
                    break;
                }
            }

            return state;
        });
    }
)

supabaseColumnStore.subscribe(() => {
    const columnIds = Object.values(supabaseColumnStore.state).flat().map((col:any) => col.id)
    taskSubscription.rescope(columnIds ? { columnIds } : null)
})

export const boards = new Derived({
    fn: () => {
        const columnsState = supabaseColumnStore.state;
        const tasksState = supabaseTaskStore.state;

        if (!columnsState) return {foo: "no columns"};
        if (!tasksState) return {foo: "no tasks"};

        if (!columnsState || !tasksState) return undefined;

        return Object.entries(columnsState).reduce(
            (boardsAcc, [boardId, columns]) => {
                boardsAcc[boardId] = (columns as any[]).reduce(
                    (columnsAcc, column) => {
                        columnsAcc[column.id] = {...column, tasks: tasksState[column.id] || []};
                        return columnsAcc;
                    },
                    {} as Record<string, string[]>
                );
                return boardsAcc;
            },
            {} as Record<string, any>
        );
    },
    deps: [supabaseColumnStore, supabaseTaskStore]
});
