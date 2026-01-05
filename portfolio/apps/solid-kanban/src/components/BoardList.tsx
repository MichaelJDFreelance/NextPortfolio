"use client";

import { useStore } from "@tanstack/solid-store";
import { getBoardsArray } from "@/lib/yjs/yDoc";
import {boardStore, setBoardId} from "@/lib/store/boardStore";
import * as Y from "yjs";
import {uiStore} from "@/lib/store/uiMachine";
import {For, Show} from "solid-js";

export function loadBoard(id: string) {
    console.log("loadBoard called with", id);

    const arr = getBoardsArray();
    if (!arr) return; // or retry as earlier described

    const yBoards = arr.toArray();
    const yBoard = yBoards.find(b => String(b.get("id")) === String(id));
    if (!yBoard) throw new Error("Board not found");

    boardStore.setState({ id, CRDT: yBoard });
    console.log("boardStore updated:", boardStore.state);
}

function BoardListItem(props: { yBoard: Y.Map<any> }) {
    const id = () => props.yBoard.get("id");
    return (
        <button
            class="cursor-pointer"
            onClick={() => setBoardId(id())}
        >
            {props.yBoard.get("name")}
        </button>
    );
}

export function BoardList() {
    const ready = useStore(uiStore, ui => ui.snapshot?.matches({ app: "ready" }) ?? false);

    return (
        <Show when={ready()} fallback={<p>Loading…</p>}>
            <BoardListReady />
        </Show>
    );
}

function BoardListReady() {
    const boards = getBoardsArray().toArray();

    if (!boards.length) return <p>No boards found.</p>;

    return (
        <div class="flex flex-col gap-6">
            <For each={boards}>
                {(b) => <BoardListItem yBoard={b} />}
            </For>
        </div>
    );
}