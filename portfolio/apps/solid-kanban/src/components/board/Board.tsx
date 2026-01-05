"use client";

import { useStore } from "@tanstack/solid-store";
import { boardStore, snapshotDerived } from "@/lib/store/boardStore";
import { uiStore } from "@/lib/store/uiMachine";
import {Column} from "@/components/board/Column";
import {For, Match, Show, Switch} from "solid-js";

export function Board() {
    const ui = useStore(uiStore);
    const core = useStore(boardStore);
    const snapshot = useStore(snapshotDerived);

    return (
        <Switch>
            <Match when={!core || !(core()?.CRDT)}>
                <div class="loading">Loading core…</div>
            </Match>

            <Match when={!ui()?.snapshot?.matches({ app: "ready" })}>
                <div class="loading">Connecting to YJS…</div>
            </Match>

            <Match when={!snapshot}>
                <div class="loading">Loading snapshot…</div>
            </Match>

            <Match when={snapshot}>
                <div class="board flex isolate">
                    <For each={snapshot()?.columns}>
                        {(c, index) => <Column id={c.id} index={index()} />}
                    </For>
                </div>
            </Match>
        </Switch>
    );
}