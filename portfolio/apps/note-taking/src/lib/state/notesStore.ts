import {Store, Derived} from "@tanstack/react-store"
import data from "@/data/data.json"
import {createSecureGUID} from "@/lib/utils";

const arrayToRecord = <T>(arr:T[]) => arr.reduce((acc, item)=>({...acc,[createSecureGUID()]:item}),{});
const recordToArray = <T>(obj:Record<string,T>) => Object.values(obj);
const getAllTags = (arr: Note[]) =>  [...new Set(arr.flatMap(item => item.tags))];

type Note = {
    id?:string;
    title: string;
    tags: string[];
    content: string;
    lastEdited: string;
    isArchived: boolean;
}

export const notesStore = new Store<Record<string, Note>>(arrayToRecord(data.notes));

export const notesArray = new Derived<Note[]>({
    deps: [notesStore],
    fn: ()=>recordToArray(notesStore.state)
})

export const tagsArray = new Derived<string[]>({
    deps: [notesStore],
    fn: ()=>getAllTags(recordToArray(notesStore.state))
})

export const mutateNote = (note: Note) =>
    notesStore.setState(notes => {
        const id = note.id ?? createSecureGUID();
        return {
            ...notes,
            [id]: { ...note, id }
        };
    });

export const deleteNote = (id:string) => notesStore.setState(notes => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: _, ...rest } = notes;
    return rest;
});

notesArray.mount();
tagsArray.mount();