import {Store, Derived} from "@tanstack/react-store";
import data from "@/lib/data/data.json"
import {diffChars, diffLines, diffWords} from "diff";

export const typingStore = new Store({
    text: data.hard[0].text,
    input: ""
})

export const setInput = (input:string) => {
    typingStore.setState(prev=>({...prev, input}))
}

function getEdit(prev: string, next: string) {
    let start = 0;

    while (
        start < prev.length &&
        start < next.length &&
        prev[start] === next[start]
        ) {
        start++;
    }

    let endPrev = prev.length - 1;
    let endNext = next.length - 1;

    while (
        endPrev >= start &&
        endNext >= start &&
        prev[endPrev] === next[endNext]
        ) {
        endPrev--;
        endNext--;
    }

    return {
        prefix: prev.slice(0, start),
        removed: prev.slice(start, endPrev + 1),
        added: next.slice(start, endNext + 1),
        suffix: prev.slice(endPrev + 1),
    };
}

function smartDiff(oldText: string, newText: string) {
    const lineDiff = diffLines(oldText, newText);

    return lineDiff.flatMap(part => {
        if (!part.added && !part.removed) {
            return part;
        }

        if (part.added) return part;

        // removed line — try word diff with nearest added line
        return diffWords(part.value, "");
    });
}

export const diffDerived = new Derived({
    deps: [typingStore],
    fn: () => {
        const edit = getEdit(typingStore.state.text, typingStore.state.input);

        return [
            { value: edit.prefix },
            { value: edit.removed, removed: true },
            { value: edit.added, added: true },
            { value: edit.suffix },
        ].filter(part => part.value.length > 0);
    },
});

diffDerived.mount();