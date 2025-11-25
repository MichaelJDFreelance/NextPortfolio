import {Store} from "@tanstack/react-store";

type MutateStoreProps = {
    state: "open" | "closed",
    id: string | undefined,
}

export const mutateStore = new Store<MutateStoreProps>({
    state: "closed",
    id: undefined,
})