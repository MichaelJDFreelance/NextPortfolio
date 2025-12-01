import * as Y from "yjs";
import fmData from "@/data/data.json";

export function seedYDocFromJSON_Flat(doc: Y.Doc) {
    const root = doc.getMap("kanban");
    const boardsArray = root.get("boards") as Y.Array<any>;

    for (const boardJSON of fmData.boards) {
        const board = new Y.Map<any>();
        board.set("id", crypto.randomUUID());
        board.set("name", boardJSON.name);

        // FLATTENED STRUCTURE
        const columnsMap = new Y.Map<any>();
        const columnOrder = new Y.Array<string>();
        const tasksMap = new Y.Map<any>();

        board.set("columns", columnsMap);
        board.set("columnOrder", columnOrder);
        board.set("tasks", tasksMap);

        // BUILD COLUMNS + TASKS
        for (const colJSON of boardJSON.columns) {
            const colId = crypto.randomUUID();

            const colMap = new Y.Map<any>();
            colMap.set("id", colId);
            colMap.set("name", colJSON.name);

            const taskOrder = new Y.Array<string>();
            colMap.set("taskOrder", taskOrder);

            columnsMap.set(colId, colMap);
            columnOrder.push([colId]);

            // Flatten tasks into the board's task map
            for (const taskJSON of colJSON.tasks) {
                const taskId = crypto.randomUUID();

                const taskMap = new Y.Map<any>();
                taskMap.set("id", taskId);
                taskMap.set("title", taskJSON.title);
                taskMap.set("description", taskJSON.description ?? "");
                taskMap.set("status", colJSON.name); // optional: or taskJSON.status

                // Subtasks stay nested
                const subtasks = new Y.Array<any>();
                taskMap.set("subtasks", subtasks);

                for (const sub of taskJSON.subtasks) {
                    const sm = new Y.Map<any>();
                    sm.set("id", crypto.randomUUID());
                    sm.set("title", sub.title);
                    sm.set("isCompleted", sub.isCompleted);
                    subtasks.push([sm]);
                }

                // Store globally
                tasksMap.set(taskId, taskMap);

                // Add to the column's ordering
                taskOrder.push([taskId]);
            }
        }

        boardsArray.push([board]);
    }
}
