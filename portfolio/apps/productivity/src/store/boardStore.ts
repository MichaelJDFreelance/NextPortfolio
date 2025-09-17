import data from "@/data.json";
import { Derived, Store } from "@tanstack/react-store";

type BoardData = {
    boards: {
        name: string;
        columns: {
            name: string;
            tasks: {
                id?: string;
                title: string;
                description: string;
                status: string;
                priority?: string;
                subtasks?: {
                    id?: string;
                    title: string;
                    isCompleted: boolean;
                }[];
            }[];
        }[];
    }[];
};

export type Task = {
    id: string;
    title: string;
    description: string;
    status: string;
    priority?: string;
    subtasks?: {
        id: string;
        title: string;
        isCompleted: boolean;
    }[];
};

export type Board = {
    name: string;
    tasks: Task[];
};

export type BoardRecord = Record<string, Board>;
export type ReshapedData = Record<string, BoardRecord>;

export const editBoard = (boardName: string, columns: string[]) => {
    boardStore.setState((prev) => {
        const currentBoard = prev[boardName] || {};
        const updatedBoard: BoardRecord = {};

        for (const colName of columns) {
            updatedBoard[colName] = currentBoard[colName] || {
                name: colName,
                tasks: [],
            };
        }

        return {
            ...prev,
            [boardName]: updatedBoard,
        };
    });
};

const transform = (data: BoardData): ReshapedData =>
    data.boards.reduce((boardsAcc, { name: boardName, columns }) => {
        const columnsMap = columns.reduce((colsAcc, { name: colName, tasks }) => {
            const transformedTasks = tasks.map(task => ({
                ...task,
                id: task.id || crypto.randomUUID(),
                subtasks: task.subtasks?.map(subtask => ({
                    ...subtask,
                    id: subtask.id || crypto.randomUUID()
                })) || []
            }));

            return {
                ...colsAcc,
                [colName]: {
                    name: colName,
                    tasks: transformedTasks
                }
            };
        }, {});

        return {
            ...boardsAcc,
            [boardName]: columnsMap
        };
    }, {});

const inverseTransform = (reshapedData: ReshapedData): BoardData => {
    return {
        boards: Object.entries(reshapedData).map(([boardName, columnsObj]) => ({
            name: boardName,
            columns: Object.entries(columnsObj).map(([colName, { name, tasks }]) => ({
                name,
                tasks
            }))
        }))
    };
};

export const boardStore = new Store<ReshapedData>(transform(data));

export const original = new Derived({
    fn: () => inverseTransform(boardStore.state),
    deps: [boardStore]
});

export const addColumn = (board: string, title: string) => {
    boardStore.setState((prev) => ({
        ...prev,
        [board]: {
            ...prev[board],
            [title]: {
                name: title,
                tasks: [],
            },
        },
    }));
};

export const createBoard = (boardName: string, columns: string[]) => {
    boardStore.setState((prev) => ({
        ...prev,
        [boardName]: columns.reduce((acc, col) => ({
            ...acc,
            [col]: {
                name: col,
                tasks: [],
            },
        }), {}),
    }));
};

export const addToColumn = (boardName: string, card: Task, column: string) => {
    boardStore.setState((prev) => {
        const board = prev[boardName];
        if (!board) return prev;

        const columnData = board[column];
        if (!columnData) return prev;

        const newCard = {
            ...card,
            id: card.id || crypto.randomUUID(),
            subtasks: card.subtasks?.map(subtask => ({
                ...subtask,
                id: subtask.id || crypto.randomUUID()
            })) || []
        };

        const updatedColumn = {
            ...columnData,
            tasks: [...columnData.tasks, newCard],
        };

        return {
            ...prev,
            [boardName]: {
                ...board,
                [column]: updatedColumn,
            },
        };
    });
};

export const moveCard = (boardName: string, columnName: string, card: Task, newColumnName: string) => {
    boardStore.setState((prev) => {
        const board = prev[boardName];
        if (!board) return prev;

        const column = board[columnName];
        const newColumn = board[newColumnName];
        if (!column || !newColumn) return prev;

        const taskIndex = column.tasks.findIndex((task) => task.id === card.id);
        if (taskIndex === -1) return prev;

        const updatedColumn = {
            ...column,
            tasks: column.tasks.filter(task => task.id !== card.id),
        };

        const updatedNewColumn = {
            ...newColumn,
            tasks: [...newColumn.tasks, card],
        };

        return {
            ...prev,
            [boardName]: {
                ...board,
                [columnName]: updatedColumn,
                [newColumnName]: updatedNewColumn,
            },
        };
    });
};

export const getColumns = (boardName: string) => {
    const board = boardStore.state[boardName];
    if (!board) return [];

    return Object.values(board);
}

/*
export const useBoardStore = () => {
    useEffect(() => {
        original.mount();
        return () => original.unmount();
    }, []);
    return original;
};
*/
