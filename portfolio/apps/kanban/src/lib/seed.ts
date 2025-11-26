import * as Y from "yjs";
import fmData from "@/data/data.json";

export function seedYDocFromJSON(doc: Y.Doc) {
    const root = doc.getMap("kanban");

    const boardsArray = root.get("boards") as Y.Array<any>;
    if (!(boardsArray instanceof Y.Array)) {
        console.warn("Seed called before boards array exists.");
        return;
    }

    console.log("Seeding YDoc from JSON...");

    for (const boardJSON of fmData.boards) {
        const board = new Y.Map<any>();
        board.set("id", crypto.randomUUID());
        board.set("name", boardJSON.name);

        const columnsArray = new Y.Array<any>();
        board.set("columns", columnsArray);

        for (const colJson of boardJSON.columns) {
            const colMap = new Y.Map<any>();
            colMap.set("id", crypto.randomUUID());
            colMap.set("name", colJson.name);

            const tasksArray = new Y.Array<any>();
            colMap.set("tasks", tasksArray);

            for (const taskJson of colJson.tasks) {
                const taskMap = new Y.Map<any>();
                taskMap.set("id", crypto.randomUUID());
                taskMap.set("title", taskJson.title);
                taskMap.set("description", taskJson.description ?? "");

                const subtasksArray = new Y.Array<any>();
                taskMap.set("subtasks", subtasksArray);

                for (const sub of taskJson.subtasks) {
                    const sm = new Y.Map<any>();
                    sm.set("id", crypto.randomUUID());
                    sm.set("title", sub.title);
                    sm.set("isCompleted", sub.isCompleted);
                    subtasksArray.push([sm]);
                }

                tasksArray.push([taskMap]);
            }

            columnsArray.push([colMap]);
        }

        boardsArray.push([board]);
    }
}

