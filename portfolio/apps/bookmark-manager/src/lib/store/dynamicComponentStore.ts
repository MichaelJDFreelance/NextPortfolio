import {Store} from "@tanstack/react-store"

export const dynamicComponentStore = new Store<Record<string, any>>({
    "sidebar-container": {
        "data-selected": "true"
    }
})

export function mergeUpdateDynamicComponentStore(name:string, update:Record<string, any>) {
    dynamicComponentStore.setState(prev=>({
        ...prev,
        [name]: {
            ...prev[name],
            ...update
        }
    }))
}