import {Store} from "@tanstack/react-store";

export type TODO = {
    id?: string;
    done: boolean;
    title: string;
}

export const todoStore = new Store<TODO[]>([])

const generateId = () => Math.random().toString(36).substring(2, 15)

export const upsertTodo = (todo: TODO) => {
    todoStore.setState((todos) => {
        const index = todos.findIndex((t) => t.id === todo.id)
        if (index >= 0) {
            // Update existing todo
            const updated = [...todos]
            updated[index] = todo
            return updated
        } else {
            // Insert new todo
            return [...todos, {...todo, id:generateId()}]
        }
    })
}

export const removeCompleted = () => {
    return todoStore.setState(todos=>todos.filter(t=>!t.done))
}