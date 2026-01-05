// counterSignals.js
import { createSignal } from "./signal";

export function createCounterSignals(actor:any) {
    const count = createSignal(0)

    actor.on("event", (event:any) => {
        if (event.type === "COUNT_CHANGED") {
            count.set(event.value)
        }
    })

    return { count }
}