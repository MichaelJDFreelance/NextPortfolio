"use client"

import {Select, SelectTrigger} from "@/components/ui/select";
import IconArrowLeft from "@/icons/icon-arrow-left.svg";
import {useForm} from "@tanstack/react-form";
import {createFeedback} from "@/lib/actions/feedback";
import {useEffect, useState} from "react";

export default function Page({params}:{params:Promise<any>}) {
    const [id, setId] = useState();

    const form = useForm({
        defaultValues: {
            title: "",
            category: "",
            detail: ""
        },
        onSubmit: ({value}) => {
            console.log(value)
        }
    })

    useEffect(()=> { params.then(params => setId(params.id)) }, [params])

    return (
        <main className={`flex flex-col items-center justify-center bg-background`}>
            <div>
                <a className={`flex gap-5.5 mt-20 text-title-3 font-bold text-neutral-2 self-start items-center pb-10`}>
                    <IconArrowLeft /> Go Back</a>
                <div className={`flex flex-col gap-10 relative bg-neutral-0 rounded-md p-10`}>
                    <h1 className={`text-title-1 text-neutral-1`}>Create New Feedback</h1>
                    <form onSubmit={e=>{
                        e.preventDefault();
                        form.handleSubmit(e)
                    }} action={createFeedback} className={`flex flex-col gap-6`}>
                        <form.Field name={`title`}>
                            {field=>(
                                <div className={`flex flex-col gap-4`}>
                                    <label className={`flex flex-col gap-0.5`}>
                                        <h2 className={`text-preset-5 text-neutral-1`}>Feedback Title</h2>
                                        <span className={`text-title-3 text-neutral-2`}>Add a short, descriptive headline</span>
                                    </label>
                                    <div className={`flex flex-col`}>
                                        <input type="text" placeholder={`Enter feedback title`} value={field.state.value}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               className={`rounded-sm bg-input px-6 py-3 text-preset-2`} />
                                        <span className={`text-destructive mt-1 text-title-3`}>Can’t be empty</span>
                                    </div>
                                </div>
                            )}
                        </form.Field>
                        <form.Field name={`title`}>
                            {field=>(
                                <div className={`flex flex-col gap-4`}>
                                    <label className={`flex flex-col gap-0.5`}>
                                        <h2 className={`text-preset-5 text-neutral-1`}>Category</h2>
                                        <span className={`text-title-3 text-neutral-2`}>
                                        Choose a category for your feedback</span>
                                    </label>
                                    <div className={`flex flex-col`}>
                                        <Select value={field.state.value} onValueChange={e=>field.handleChange(e)}>
                                            <SelectTrigger className={`rounded-sm bg-input px-6 py-3 w-full text-preset-2`}>
                                                Feature</SelectTrigger>
                                        </Select>
                                        <span className={`text-destructive mt-1 text-title-3`}>Can’t be empty</span>
                                    </div>
                                </div>
                            )}
                        </form.Field>
                        <form.Field name={`title`}>
                            {field=>(
                                <div className={`flex flex-col gap-4`}>
                                    <label className={`flex flex-col gap-0.5`}>
                                        <h2 className={`text-preset-5 text-neutral-1`}>Feedback Detail</h2>
                                        <span className={`text-title-3 text-neutral-2`}>Include any specific
                                        comments on what should be improved, added, etc.</span>
                                    </label>
                                    <div className={`flex flex-col`}>
                                        <textarea placeholder={`Enter feedback title`} value={field.state.value}
                                                  onChange={e=>field.handleChange(e.target.value)}
                                                  className={`rounded-sm bg-input px-6 py-3 text-preset-2`} />
                                        <span className={`text-destructive mt-1 text-title-3`}>Can’t be empty</span>
                                    </div>
                                </div>
                            )}
                        </form.Field>
                        <div className={`mt-2 flex gap-4 justify-end items-center`}>
                            <button type="reset" className={`bg-neutral-1 text-neutral-0 px-6 py-3 rounded-md`}>Cancel</button>
                            <button className={`bg-primary text-neutral-0 px-6 py-3 rounded-md`}>Add Feedback</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}