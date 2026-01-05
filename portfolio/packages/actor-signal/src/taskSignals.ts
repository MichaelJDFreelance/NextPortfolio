// taskSignals.js
import { createSignal } from "./signal.js";

export function createTaskSignals(actor:any) {
    const tasks = createSignal([]);

    actor.on("event", (event:any) => {
        switch (event.type) {
            case "TASK_ADDED":
                tasks.set([...tasks.get(), event.task]);
                break;

            case "TASK_COMPLETED":
                tasks.set(
                    tasks.get().map((t:any) =>
                        t.id === event.id ? { ...t, completed: true } : t
                    )
                );
                break;
        }
    });

    return { tasks };
}
