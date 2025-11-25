"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { seedYDocFromJSON } from "@/lib/seed";
import { WithChildren } from "@/lib/types";

type YContextValue = { doc: Y.Doc };
const YContext = createContext<YContextValue | null>(null);

export const YProvider = ({ children }: WithChildren) => {
    const [ready, setReady] = useState(false);

    const doc = useMemo(() => new Y.Doc(), []);

    useEffect(() => {
        const persistence = new IndexeddbPersistence("kanban-crdt", doc);

        persistence.whenSynced.then(() => {
            console.log("1. BEFORE ANYTHING:", doc.toJSON());

            const root = doc.getMap("kanban");
            console.log("2. AFTER GET ROOT:", root.toJSON());

            let boards = root.get("boards");
            console.log("3. BOARDS BEFORE FIX:", boards, (boards as any)?.toJSON?.());

            if (!(boards instanceof Y.Array)) {
                boards = new Y.Array();
                root.set("boards", boards);
            }
            console.log("4. BOARDS AFTER FIX:", (boards as any).toJSON());

            if ((boards as any).length === 0) {
                console.log("5. SEEDING NOW");
                seedYDocFromJSON(doc);
            } else {
                console.log("5. NO SEED NEEDED");
            }

            console.log("6. AFTER SEED:", root.toJSON());

            setReady(true);
        })
    }, [doc]);

    if (!ready) return null;

    return <YContext.Provider key={ready ? "ready" : "not-ready"} value={{ doc }}>
        {ready ? children : null}
    </YContext.Provider>;
};

export const useYDoc = () => {
    const ctx = useContext(YContext);
    if (!ctx) throw new Error("useYDoc must be used inside <YProvider>");
    return ctx.doc;
};
