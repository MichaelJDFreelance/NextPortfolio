"use client";

import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { seedYDocFromJSON_Flat } from "@/lib/seed";
import {uiService} from "@/lib/store/uiMachine";

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

    if (!(boards instanceof Y.Array)) {
        boards = new Y.Array();
        root.set("boards", boards);

        doc.transact(() => {
            seedYDocFromJSON_Flat(doc);
        });
    }

    _boardsArray = boards as any;

    // 🔥 NEW: notify your UI machine
    uiService.send({ type: "YJS_READY" });
});