import { Store, Derived } from "@tanstack/react-store";

const retrieveFromLocalStorage = (key: string) => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : {}
}

const shuffleSignal = new Store(0);

function shuffleArray<T>(arr: T[]): T[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

type Question = {
    question: string,
    answer: string,
    category: string,
    known: boolean
}

export const currentIndexStore = new Store(0)

export const selectedCategoriesStore = new Store<string[]>(["Web Development"])

export const questionStore = new Store<Record<string, Question>>(retrieveFromLocalStorage("questions"))

questionStore.subscribe(state => localStorage.setItem('questions', JSON.stringify(state)))

export const filteredQuestions = new Derived({
    deps: [questionStore, selectedCategoriesStore],
    fn: () => {
        const questions = questionStore.state;
        return (Object.values(questions)).filter(q=>selectedCategoriesStore.state.includes(q.category));
    }
})

export const shuffledQuestions = new Derived({
    deps: [filteredQuestions, shuffleSignal],
    fn: () => {
        const questions = filteredQuestions.state;
        return shuffleArray(questions);
    }
})

filteredQuestions.mount();
shuffledQuestions.mount();

export function reshuffleQuestions() {
    shuffleSignal.setState(s => s + 1);
}

export const markAnswerAsKnown = (id: string) => {
    questionStore.setState(prev=>({...prev,[id]: {...prev[id], known: true}}))
}

export const nextQuestion = () => {
    currentIndexStore.setState(prev=>prev<shuffledQuestions.state.length-1?prev+1:0)
}

export const previousQuestion = () => {
    currentIndexStore.setState(prev=>prev>0?prev-1:0)
}