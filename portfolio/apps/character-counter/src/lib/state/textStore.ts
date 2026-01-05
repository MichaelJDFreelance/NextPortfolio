import {Store, Derived} from "@tanstack/react-store";

export const textStore = new Store({
    text: "",
    excludeSpaces: false,
    setCharacterLimit: 0
})

export const letterDensity = new Derived({
    deps: [textStore],
    fn: () => {
        const letters = textStore.state.text.replace(/\s/g, "").split("");
        const record = letters.reduce((acc, curr)=> {
            if (acc[curr]) acc[curr]++
            else acc[curr] = 1
            return acc
        }, {} as Record<string, number>)
        const asOrderedArray = Object.entries(record).sort((a, b)=>b[1]-a[1])
        return asOrderedArray.map(entry=>({text:entry[0], count:entry[1]}))
    }
})

export const letterStats = new Derived({
    deps: [textStore],
    fn: () => {
        const text = textStore.state.text;
        const noSpaces = textStore.state.excludeSpaces ? text.replace(/\s/g, "") : text;

        return {
            letters: noSpaces.length,
            words: text.trim().split(/\s+/).filter(Boolean).length,
            sentences: text.split(/[.!?]+/).filter(Boolean).length,
        };
    }
})

letterDensity.mount()
letterStats.mount()

export const updateText = (text:string) =>
    textStore.setState(prev=>({...prev, text}))

export const updateCharacterLimit = (characterLimit:number) =>
    textStore.setState(prev=>({...prev, setCharacterLimit:characterLimit}))

export const updateExcludeSpaces = (excludeSpaces:boolean) =>
    textStore.setState(prev=>({...prev, excludeSpaces}))