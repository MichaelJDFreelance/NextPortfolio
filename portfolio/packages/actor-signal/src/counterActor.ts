// counterActor.js
import EventEmitter from "events";

export class CounterActor extends EventEmitter {
    #count = 0

    emit = super.emit.bind(this);

    send(command:any) {
        switch (command.type) {
            case "INC":
                this.#count++
                this.emit("event", { type: "COUNT_CHANGED", value: this.#count })
                break

            case "DEC":
                if (this.#count === 0) return
                this.#count--
                this.emit("event", { type: "COUNT_CHANGED", value: this.#count })
                break
        }
    }
}