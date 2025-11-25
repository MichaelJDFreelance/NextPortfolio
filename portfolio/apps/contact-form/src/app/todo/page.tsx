import {ThemeToggle} from "@/components/todo/ThemeToggle";
import {Todo} from "@/components/todo/Todo";
import {TodoList} from "@/components/todo/TodoList";

export default function Page() {
    return (
        <div className={`todo-app bg-white td-bg dark-theme:td-bg-dark  dark-theme:bg-black 
                min-h-screen min-w-screen flex flex-col items-center`}>
            <header className={`py-16 flex justify-between w-full max-w-[540px]`}>
                <h1 className={`td-text-xl text-white`}>TODO</h1>
                <ThemeToggle />
            </header>
            <Todo id={"test"} />
            <TodoList />
        </div>
    );
}