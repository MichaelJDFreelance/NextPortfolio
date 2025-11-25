import * as Y from "yjs";

export const getKanbanRoot = (doc: Y.Doc) => {
    const root = doc.getMap("kanban");

    return root;
};