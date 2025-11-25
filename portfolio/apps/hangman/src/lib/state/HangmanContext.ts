import { createMachine, assign } from "xstate";

interface HangmanContext {
    phrase: string;
    guessedLetters: string[];
    blankedWord: string;
    remainingAttempts: number;
    maxAttempts: number;
}

type HangmanEvent =
    | { type: "START"; phrase: string; maxAttempts?: number }
    | { type: "GUESS"; letter: string }
    | { type: "RESET" };

export const hangmanMachine = createMachine({
    types: {} as {
        context: HangmanContext;
        events: HangmanEvent;
    },
    id: "hangman",
    initial: "idle",
    context: {
        phrase: "",
        guessedLetters: [],
        remainingAttempts: 6,
        maxAttempts: 6,
        blankedWord: ""
    },

    on: {
        START: {
            target: ".playing",
            actions: assign(({ event }) => ({
                phrase: event.phrase.toLowerCase(),
                blankedWord: event.phrase.toLowerCase(),
                guessedLetters: [],
                remainingAttempts: event.maxAttempts ?? 6,
                maxAttempts: event.maxAttempts ?? 6,
            })),
        },
    },

    states: {
        idle: { },

        playing: {
            on: {
                GUESS: {
                    actions: assign(({ context, event }) => {
                        const letter = event.letter.toLowerCase();
                        if (context.guessedLetters.includes(letter)) return context;

                        const isCorrect = context.phrase.includes(letter);
                        return {
                            ...context,
                            guessedLetters: [...context.guessedLetters, letter],
                            remainingAttempts: isCorrect
                                ? context.remainingAttempts
                                : context.remainingAttempts - 1,
                        };
                    }),
                },
            },
            // v5: use `always` for eventless/transient transitions
            always: [
                { target: "won", guard: ({ context }) => hasWon(context) },
                { target: "lost", guard: ({ context }) => context.remainingAttempts <= 0 },
            ],
        },

        won: {
            entry: () => console.log("🎉 You won!"),
            on: { RESET: "idle" }, // keep START restricted to idle
        },

        lost: {
            entry: () => console.log("💀 Game over!"),
            on: { RESET: "idle" }, // keep START restricted to idle
        },
    },
});

// Utility
function hasWon(ctx: HangmanContext) {
    return ctx.phrase.split("").every((letter) => ctx.guessedLetters.includes(letter));
}