import {Store} from "@tanstack/react-store";
import data from "@/data.json";

export const columnOrderStore = new Store<Record<string, string[]>>({
    ...data.boards.reduce((acc, board) => ({
        ...acc,
        [board.name]: board.columns.map(column => column.name)
    }), {} as Record<string, string[]>)
});
