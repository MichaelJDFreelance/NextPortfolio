"use client";

import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { seedYDocFromJSON } from "@/lib/seed";
import {boardsReady, boardsVersion} from "@/lib/store/boardsVersion";

export const doc = new Y.Doc();
export const root = doc.getMap("kanban");

let _boardsArray: Y.Array<any> | null = null;

export function getBoardsArray(): Y.Array<any> {
    if (!_boardsArray) {
        throw new Error("boardsArray not ready yet (wait for whenSynced)");
    }
    return _boardsArray;
}

const persistence = new IndexeddbPersistence("kanban-crdt", doc);

console.log("YJS INIT — starting");

persistence.whenSynced.then(() => {
    console.log("YJS — whenSynced resolved");

    let boards = root.get("boards");

    let didSeed = false;

    if (!(boards instanceof Y.Array)) {
        boards = new Y.Array();
        root.set("boards", boards);

        // 🔥 IMPORTANT: seed inside a Yjs transaction
        doc.transact(() => {
            seedYDocFromJSON(doc);
        });

        didSeed = true;
    }

    _boardsArray = boards as any;

    if (didSeed) {
        // 🔥 must happen AFTER the transact() block
        boardsVersion.setState(v => v + 1);
    }

    boardsReady.setState(true);

    console.log("YJS — _boardsArray set:", (boards as any).toJSON());
});