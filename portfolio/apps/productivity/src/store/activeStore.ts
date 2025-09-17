import {Store} from "@tanstack/react-store";
import {boardStore} from "@/store/boardStore";

export const activeBoardStore = new Store<string|null>(null);

const initialBoardNames = Object.keys(boardStore.state);
if (initialBoardNames.length > 0 && !activeBoardStore.state) {
    activeBoardStore.setState(()=>initialBoardNames[0]);
}