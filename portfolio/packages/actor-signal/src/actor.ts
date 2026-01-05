// actor.js
import EventEmitter from "events";

export class Actor extends EventEmitter {
    #queue = [] as any[];
    #processing = false;

    send(command:any) {
        this.#queue.push(command);
        this.#process();
    }

    async #process() {
        if (this.#processing) return;
        this.#processing = true;

        while (this.#queue.length) {
            const cmd = this.#queue.shift();
            await this.handle(cmd);
        }

        this.#processing = false;
    }

    async handle(_command:any) {
        throw new Error("handle() must be implemented");
    }

    emitEvent(event:any) {
        this.emit("event", event);
    }
}