"use client";

import { useStore } from "@tanstack/react-store";
import { boardStore, snapshotDerived } from "@/lib/store/boardStore";
import { uiStore } from "@/lib/store/uiMachine";
import {Column} from "@/components/board/Column";

export function Board() {
    const ui = useStore(uiStore);

    const core = useStore(boardStore);
    const snapshot = useStore(snapshotDerived);

    if (!core || !core.CRDT) return <div className="loading">Loading…
        {(!!core).toString()}
        <pre>{JSON.stringify(core)}</pre>
    </div>;
    //if (!snapshot || !lookup) return <div className="loading">Loading…</div>;
    const uiReady = ui.snapshot?.matches({ app: "ready" }) ?? false;
    if (!uiReady) return <div className="loading">Loading…</div>;

    return (
                <div className="board flex isolate">
                    {snapshot!.columns.map((c, index) => (
                        <Column key={c.id} id={c.id} index={index} />
                    ))}
                </div>
    );
}
