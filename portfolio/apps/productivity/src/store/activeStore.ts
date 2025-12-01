import {Store} from "@tanstack/react-store";
import {boardStore} from "@/store/boardStore";

export const activeBoardStore = new Store<string|null>("12f9e138-eb59-4e8f-98c5-bda00f1d5c99");

const initialBoardNames = Object.keys(boardStore.state);
if (initialBoardNames.length > 0 && !activeBoardStore.state) {
    activeBoardStore.setState(()=>initialBoardNames[0]);
}