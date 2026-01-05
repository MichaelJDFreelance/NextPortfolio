/*
// index.js
import { CounterActor } from "./counterActor";
import { createCounterSignals }  from "./counterSignals";

const actor = new CounterActor()
const { count } = createCounterSignals(actor)

// UI-ish consumers
count.subscribe((value:any) => {
    console.log("Count is now:", value)
})

// Commands
actor.send({ type: "INC" })
actor.send({ type: "INC" })
actor.send({ type: "DEC" })
actor.send({ type: "DEC" })
actor.send({ type: "DEC" }) // ignored*/


// index.js
import { TaskActor } from "./taskActor.js";
import { createTaskSignals } from "./taskSignals.js";

const actor = new TaskActor();
const { tasks } = createTaskSignals(actor);

tasks.subscribe((t:any) => {
    console.log("Tasks:", t);
});

actor.send({ type: "ADD_TASK", id: "1", title: "Write code" });
actor.send({ type: "ADD_TASK", id: "2", title: "Test system" });
actor.send({ type: "COMPLETE_TASK", id: "1" });
actor.send({ type: "COMPLETE_TASK", id: "2" });