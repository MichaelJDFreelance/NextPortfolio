import {Store, Derived} from "@tanstack/react-store"
import {Entertainment} from "@/lib/types";
import data from "@/data/data.json"
import Fuse from "fuse.js"

export const movieStore = new Store<Entertainment[]>(data.map(d=>({id:crypto.randomUUID(), ...d})));
export const queryStore = new Store("");
export const bookmarkStore = new Store<string[]>([]);

export const isTrending = (item:Entertainment) => item.isTrending;
export const isRecommended = () => true;
export const isBookmarked = (item:Entertainment) => item.id && bookmarkStore.state.includes(item.id);
export const isTV = (item:Entertainment) => item.category==="TV Series";
export const isMovie = (item:Entertainment) => item.category==="Movie";

const getSearchResults = (movies:Entertainment[], query:string) => {
    const fuse = new Fuse(movies, {
        keys: ['title'],
        threshold: 0.3
    });
    return fuse.search(query).map(result => result.item);
}

export const searchResults = new Derived({
    deps:[queryStore, movieStore],
    fn:()=>queryStore.state? getSearchResults(movieStore.state, queryStore.state) : movieStore.state
})
searchResults.mount();

export const toggleBookmark = (id?:string) => {
    return () => {
        if (!id) return;
        bookmarkStore.setState(prev => prev.includes(id)? prev.filter(i=>i!==id) : [...prev, id]);
    }
}