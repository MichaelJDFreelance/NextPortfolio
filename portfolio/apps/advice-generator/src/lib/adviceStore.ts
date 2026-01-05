import {Store} from "@tanstack/react-store"
import {getQuote} from "@/lib/quoteGenerator";

type Quote = {
    id:string,
    text:string
}

export const adviceStore = new Store<Quote|undefined>(await getQuote());

export const setQuote = async () => {
    const quote = await getQuote();
    adviceStore.setState(val=>quote);
}