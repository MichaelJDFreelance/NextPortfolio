import {Store, Derived} from '@tanstack/react-store'

export type Duration =
    "pomodoro" |
    "shortBreak" |
    "longBreak"

type Settings = {
    durations: Record<Duration, number>
    theme: string,
    font: string
}

export const settingsStore = new Store<Settings>({
    durations: {
        pomodoro: 600,
        shortBreak: 0.1,
        longBreak: 200
    },
    theme: "hotpink",
    font: "sans"
});

export const durationStore = new Store<Duration>("shortBreak");

export const durationDerived = new Derived({
    deps: [settingsStore, durationStore],
    fn: () => {
        const settings = settingsStore.state
        const duration = durationStore.state
        return settings.durations[duration]
    },
})

durationDerived.mount()