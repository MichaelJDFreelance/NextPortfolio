import {Store} from "@tanstack/react-store"

export const basketStore = new Store<Record<string, number>>({});
export const modalOpen = new Store<boolean>(false);

basketStore.subscribe(state=>localStorage.setItem("basket", JSON.stringify(state)))

export function addOne(name:string) {
    basketStore.setState(state=>{
        const updated =
            state[name]?
                state[name] + 1:
                1;
        return {...state, [name]: updated}
    })
}

export function minusOne(name:string) {
    basketStore.setState(state=>{
        const updated =
            (state[name] && state[name] > 0)?
                state[name] - 1:
                0;
        return {...state, [name]: updated}
    })
}