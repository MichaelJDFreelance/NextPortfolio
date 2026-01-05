import {EditorView} from "prosemirror-view";
import {editorStore, PMState, syncYDoc} from "@/lib/state/editorStore";
import { WebsocketProvider } from "y-websocket";
import {EditorState} from "prosemirror-state";
import {schema} from "prosemirror-schema-basic";
import {ySyncPlugin, yUndoPlugin} from "y-prosemirror";
import * as Y from "yjs";
import { Plugin } from "prosemirror-state"

export function createDocument(docId: string) {
    const ydoc = new Y.Doc({ guid: docId });

    const provider = new WebsocketProvider(
        "ws://localhost:9000/md",   // base path
        docId,                      // room name
        ydoc                        // document
    );

    provider.on("status", (event:any) => {
        console.log("WS status:", event.status);
    });

    editorStore.setState((s) => ({
        ...s,
        ydoc,
        awareness: provider.awareness,
        yXmlFragment: ydoc.getXmlFragment("prosemirror"),
        status: (provider as any).wsconnected ? "connected" : "disconnected",
    }));

    const stopSync = syncYDoc(ydoc);

    return {
        ydoc,
        provider,
        stop: () => {
            provider.destroy();
            stopSync();
        },
    };
}

export function createEditorEngine({
                                       fragment,
                                       onState,
                                   }: {
    fragment: Y.XmlFragment
    onState: (pmState: PMState) => void
}) {

    const notifyPlugin = new Plugin({
        state: {
            init() {
                return null;
            },
            apply(_, prev) {
                return prev; // We don’t store anything, we only want the view hook
            }
        },

        view() {
            return {
                update(view, prevState) {
                    // only trigger when the editor state changes
                    if (prevState !== view.state) {
                        onState(view.state);
                    }
                }
            };
        }
    });

    const state = EditorState.create({
        schema,
        plugins: [
            ySyncPlugin(fragment),
            yUndoPlugin(),
            notifyPlugin,
        ],
    });

    const view = new EditorView(null, { state });

    return { view };
}