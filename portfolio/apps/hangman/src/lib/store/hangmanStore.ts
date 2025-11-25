import { Store } from "@tanstack/react-store";
import { createActor } from "xstate";
import { hangmanMachine } from "../state/HangmanContext";

const hangmanActor = createActor(hangmanMachine).start();
export const hangmanStore = new Store(hangmanActor.getSnapshot());

// Debug: log all state changes
hangmanActor.subscribe((snapshot) => {
    console.log("Transitioned to:", snapshot.value, snapshot.context);
    hangmanStore.setState(snapshot);
});

export const startGame = (phrase: string) => {
    console.log("Sending START event:", phrase);
    hangmanActor.send({ type: "START", phrase, maxAttempts: 8 });
};

export const guessLetter = (letter: string) => {
    hangmanActor.send({ type: "GUESS", letter });
};