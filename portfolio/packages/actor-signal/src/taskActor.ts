// taskActor.js
import Bottleneck from "bottleneck";
import { Actor } from "./actor.js";

export class TaskActor extends Actor {
    #tasks = new Map();

    // Side-effect governor
    #limiter = new Bottleneck({
        maxConcurrent: 2,
        minTime: 200
    });

    async handle(command:any) {
        switch (command.type) {
            case "ADD_TASK": {
                const task = {
                    id: command.id,
                    title: command.title,
                    completed: false
                };

                this.#tasks.set(task.id, task);

                this.emitEvent({
                    type: "TASK_ADDED",
                    task
                });
                break;
            }

            case "COMPLETE_TASK": {
                const task = this.#tasks.get(command.id);
                if (!task || task.completed) return;

                task.completed = true;

                this.emitEvent({
                    type: "TASK_COMPLETED",
                    id: task.id
                });

                // Side effect is rate-limited
                await this.#limiter.schedule(() =>
                    this.syncTask(task)
                );

                this.emitEvent({
                    type: "TASK_SYNCED",
                    id: task.id
                });

                break;
            }
        }
    }

    async syncTask(task:any) {
        // Simulate IO
        await new Promise(r => setTimeout(r, 300));
        console.log("Synced task:", task.id);
    }
}
