import {Store} from "@tanstack/react-store";

type CalcState = {
    expression: string[];
    result: number|undefined;
    error?:string;
}

export const calcStore = new Store<CalcState>({
    expression: [],
    result: undefined
})