"use client"

import {ReactNode} from "react";
import {useForm} from "@tanstack/react-form";

type HasChildren = {
    children: ReactNode;
}

export function Form({children}:HasChildren) {
    const form = useForm({
        onSubmit: () => {
            alert("submitted")
        }
    })

    return (
        <form onSubmit={form.handleSubmit} className={`grid md:grid-cols-2 gap-y-6 gap-x-4`}>
            {children}
        </form>
    );
}