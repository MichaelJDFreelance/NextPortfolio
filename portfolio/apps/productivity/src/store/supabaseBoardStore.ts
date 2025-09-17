import {supabase} from "@/lib/supabase";
import {Derived, Store} from "@tanstack/react-store";

export const supabaseBoardStore = new Store<any>(undefined)

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
