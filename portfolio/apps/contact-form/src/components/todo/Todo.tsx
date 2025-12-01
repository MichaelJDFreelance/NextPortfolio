"use client"

import {Checkbox} from "@/components/ui/checkbox";
import {useForm} from "@tanstack/react-form";
import {FormEvent} from "react";
import {useStore} from "@tanstack/react-store";
import {todoStore, upsertTodo} from "@/lib/todo/todoStore";

export function Todo({id}:{id?:string}) {
    const todo = useStore(todoStore, td=>td.find(t=>id && t.id===id))

    const defaultValues = todo || {
        done: false,
        title: ""
    }

    const form = useForm({
        defaultValues,
        onSubmit: ({value}) => {
            upsertTodo(value);
            if (!id) form.reset();
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement> | undefined) => {
        e?.preventDefault();
        form.handleSubmit(e);
    }

    return (
        <form onSubmit={handleSubmit} className={`dark-theme:bg-25273D flex gap-6 items-center bg-white w-full max-w-[540px] px-6 py-4.5 rounded-md`}>
            <form.Field name={"done"}>
                {field=>(
                    <Checkbox checked={field.state.value} onCheckedChange={(e)=> {
                        field.handleChange(e === true)
                        if (id) {
                            form.handleSubmit();
                        }
                    }}
                              className={`checkbox rounded-full border w-6 h-6`} />
                )}
            </form.Field>
            <form.Field name={"title"}>
                {field=>(
                    <input value={field.state.value} onChange={e=>field.handleChange(e.target.value)}
                           className={`outline-0`} placeholder={`Create a new todo`} />
                )}
            </form.Field>
        </form>
    );
}