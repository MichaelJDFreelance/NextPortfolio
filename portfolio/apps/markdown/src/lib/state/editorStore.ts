import {Derived, Store} from "@tanstack/store";
import * as Y from "yjs";
import {EditorState} from "prosemirror-state";
import { defaultMarkdownSerializer as markdownSerializer } from "prosemirror-markdown";

export type PMState = EditorState | null

type EditorStoreState = {
    docId: string | null;
    ydoc: any;
    awareness: any;
    status: "connected" | "disconnected";
    yXmlFragment: Y.XmlFragment | null;
    pmState: PMState;       // 👈 we'll populate this
};

export const editorStore = new Store<EditorStoreState>({
    docId: null,
    ydoc: null,
    awareness: null,
    status: "disconnected",
    yXmlFragment: null,
    pmState: null,       // 👈 we'll populate this
});

export function syncYDoc(ydoc: Y.Doc) {
    const yXmlFragment = ydoc.getXmlFragment("prosemirror");

    editorStore.setState((s) => ({
        ...s,
        ydoc,
        yXmlFragment,
    }));

    const handler = () => editorStore.setState((s) => ({ ...s }));

    // Observe all nested changes within the XML tree
    yXmlFragment.observeDeep(handler);

    yXmlFragment.observeDeep(() => {
        console.log("YJS changed:", yXmlFragment.toString());
    });


    return () => yXmlFragment.unobserveDeep(handler);
}

export const usersDerived = new Derived({
    deps: [editorStore],
    fn: () => {
        const a = editorStore.state.awareness;
        if (!a) return [];

        const entries = Array.from(
            a.getStates().entries() as IterableIterator<[number, any]>
        );

        return entries.map(([clientId, state]) => ({
            id: clientId,
            name: state.user?.name,
            color: state.user?.color,
            cursor: state.cursor,
        }));
    },
});

export const markdownDerived = new Derived({
    deps: [editorStore],
    fn: () => {
        const pmState = editorStore.state.pmState;
        if (!pmState) return "";

        return markdownSerializer.serialize(pmState?.doc);
    },
});

usersDerived.mount();
markdownDerived.mount();