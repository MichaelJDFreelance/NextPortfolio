import {createMachine, assign, createActor} from "xstate";
import {tokenize} from "@/lib/calculator/tokeniser";
import {Parser} from "@/lib/calculator/ast-parser";
import {evaluate} from "@/lib/calculator/recursive-descent";
import {calcStore} from "@/lib/calculator/store/calcStore";

interface CalculatorContext {
    expression: string[];
    result: number | undefined;
    error?: string;
}

type CalculatorEvent =
    | { type: "INPUT_KEY"; key: string; }
    | { type: "DELETE"; }
    | { type: "EVALUATE"; }
    | { type: "RESET"; }

const isDigit = (t: string) => /^[0-9]$/.test(t);

const isNumberToken = (token: string) =>
    token !== "" &&
    token !== "." &&
    !Number.isNaN(Number(token));

export const shouldAddNewInputToLast = (last: string | undefined, key: string) => {
    if (!last) return false;

    // Case 1: merging digits: "12" + "3"
    if (isNumberToken(last) && isDigit(key)) {
        return true;
    }

    // Case 2: decimal support: "12" + "."
    if (isNumberToken(last) && key === ".") {
        // Only allow one decimal in the number
        return !last.includes(".");
    }

    return false;
};

const isOperator = (t: string | undefined) => t !== undefined && ["+", "-", "*", "/"].includes(t);


const calculatorMachine = createMachine({
    types: {} as {
        context: CalculatorContext;
        events: CalculatorEvent;
    },
    id: "calculator",
    initial: "receivingInput",
    context: {
        expression:[],
        result: undefined
    },

    states: {
        showingResult: {
            on: {
                INPUT_KEY: {
                    target: "receivingInput",
                    actions: assign(({ context, event }) => {
                        const key = event.key;
                        const result = context.result;

                        // Safety check
                        if (result === undefined) {
                            return {
                                expression: [key],
                                result: undefined
                            };
                        }

                        // 1. If key is a number, start a fresh expression
                        if (isDigit(key) || key === ".") {
                            return {
                                expression: [key],
                                result: undefined
                            };
                        }

                        // 2. If key is an operator, continue from the result
                        return {
                            expression: [String(result), key],
                            result: undefined
                        };
                    })
                },
                DELETE: {
                    target: "receivingInput",
                    actions: assign({
                        expression: () => [],
                        result: () => undefined
                    })
                }
            }
        },

        receivingInput: {
            on: {
                INPUT_KEY: {
                    actions: assign(({ context, event }) => {
                        const last = context.expression.at(-1);

                        // if last is a number and machine receives a number, concatenate them as the new "last"
                        const expression = (event.key === "-" && (last === undefined || isOperator(last))) ?
                            [...context.expression, "-"]:
                            (shouldAddNewInputToLast(last, event.key))?
                                [
                                    ...context.expression.slice(0, -1),
                                    last + event.key
                                ]:
                                (isOperator(last) && isOperator(event.key))?
                                    context.expression:
                                    [...context.expression, event.key];

                        // otherwise push a new token
                        return {
                            expression,
                            result: undefined,
                        };
                    })
                },
                DELETE: {
                    actions: assign(({ context }) => ({
                        expression: context.expression.slice(0, -1),
                        result: undefined
                    })),
                },
                RESET: {
                    actions: assign(({ context }) => ({
                        expression: [],
                        result: undefined
                    })),
                },
                EVALUATE: {
                    actions: assign(({ context }) => {
                        try {
                            const tokens = tokenize(context.expression.join(""));
                            const ast = Parser(tokens);
                            return {
                                expression: [],
                                result: evaluate(ast)
                            };
                        } catch {
                            return {
                                expression: [],
                                result: undefined,
                                error: "Invalid expression"
                            };
                        }
                    }),
                },
            },
        },

    },
});

export const calculatorActor = createActor(calculatorMachine).start();

calculatorActor.subscribe((snapshot) => {
    calcStore.setState({
        expression: snapshot.context.expression,
        result: snapshot.context.result,
        error: snapshot.context.error
    });
});