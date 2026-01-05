"use client";

import { useEffect, useRef } from "react";
import {editorStore} from "@/lib/state/editorStore";
import { useStore } from "@tanstack/react-store";
import {createDocument, createEditorEngine} from "@/lib/state/ydoc";
import {EditorView} from "prosemirror-view";

export function EditorPane() {
    const yXmlFragment = useStore(editorStore, (s) => s.yXmlFragment);

    return (
        <>
            {!yXmlFragment && <button onClick={()=>createDocument("abc123")}>Add Document</button>}
            {!!yXmlFragment && <EditorPanel />}
        </>
    );
}

function EditorPanel() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);

    const yXmlFragment = useStore(editorStore, (s) => s.yXmlFragment);

    useEffect(() => {
        if (!yXmlFragment) return;
        if (!mountRef.current) return;

        // Create the editor view if not already created
        if (!viewRef.current) {
            const { view } = createEditorEngine({
                fragment: yXmlFragment,
                onState: (pmState) =>
                    editorStore.setState((s) => ({ ...s, pmState })),
            });

            viewRef.current = view;

            // 🚀 Correct: mount the editor DOM node
            mountRef.current.appendChild(view.dom);
        }

        return () => {
            if (viewRef.current) {
                viewRef.current.destroy();
                viewRef.current = null;
            }
        };
    }, [yXmlFragment]);

    return (
        <div
            ref={mountRef}
            className="editor-panel bg-blue-200 min-h-screen min-w-[800px] p-5"
        />
    );
}
