import {Store} from "@tanstack/react-store"

type Settings = {
    font?:string
}

export const settingsStore = new Store<Settings>({})