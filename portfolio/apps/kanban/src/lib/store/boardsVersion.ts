// boardsVersion.ts
"use client";

import { Store } from "@tanstack/react-store";
import { getBoardsArray } from "@/lib/yjs/yDoc";

export const boardsVersion = new Store(0);

function attachBoardsObserver() {
    let boards;
    try {
        boards = getBoardsArray();
    } catch {
        setTimeout(attachBoardsObserver, 50);
        return;
    }

    console.log("[boardsVersion] attach observer");

    // Bump once immediately
    boardsVersion.setState(prev => {
        console.log("[boardsVersion] bump (initial)", prev + 1);
        return prev + 1;
    });

    boards.observe(() => {
        boardsVersion.setState(prev => {
            console.log("[boardsVersion] bump (via observe)", prev + 1);
            return prev + 1;
        });
    });
}

attachBoardsObserver();

export const boardsReady = new Store(false);


