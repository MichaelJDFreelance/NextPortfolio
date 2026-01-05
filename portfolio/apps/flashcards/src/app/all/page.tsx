"use client"

import IconPlus from "@portfolio/icons/flashcards/icon-circle-plus"
import { useForm } from "@tanstack/react-form";
import { v4 as uuid } from "uuid"
import { questionStore } from "@/state/questionStore";

export default function AllCardsPage() {
    const form = useForm({
        defaultValues: {
            id: uuid(),
            question: "",
            answer: "",
            category: ""
        },
        onSubmit: ({ value }) => {
            console.log(value)
            if (value?.id) {
                questionStore.setState(prev => ({
                    ...prev,
                    [value.id]: value
                }))
            }
        }
    })

    return (
        <div className="flex items-center justify-center font-sans bg-background">
            <main className="grid xl:grid-cols-[1fr_auto] w-fit max-w-screen items-center justify-center gap-8 py-32 px-16 sm:items-start">

                <form
                    onSubmit={e => {
                        e.preventDefault();
                        form.handleSubmit(e);
                    }}
                    className="flex flex-col p-8 gap-6"
                >

                    <div className="flex flex-col gap-4">

                        {/* Question */}
                        <form.Field
                            name="question"
                            validators={{
                                onChange: ({ value }) =>
                                    value.length < 3
                                        ? "Question must be at least 3 characters"
                                        : undefined,
                            }}
                        >
                            {field => (
                                <label className="flex flex-col gap-2">
                                    <span>Question</span>
                                    <input
                                        className="p-4 border border-neutral-900 rounded-[6px]"
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                        placeholder="e.g., What is the capital of France?"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <span className="text-red-500 text-sm">
                                            {field.state.meta.errors[0]}
                                        </span>
                                    )}
                                </label>
                            )}
                        </form.Field>

                        {/* Answer */}
                        <form.Field
                            name="answer"
                            validators={{
                                onChange: ({ value }) =>
                                    !value ? "Answer is required" : undefined,
                            }}
                        >
                            {field => (
                                <label className="flex flex-col gap-2">
                                    <span>Answer</span>
                                    <input
                                        className="p-4 border border-neutral-900 rounded-[6px]"
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                        placeholder="e.g., Paris"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <span className="text-red-500 text-sm">
                                            {field.state.meta.errors[0]}
                                        </span>
                                    )}
                                </label>
                            )}
                        </form.Field>

                        {/* Category */}
                        <form.Field
                            name="category"
                            validators={{
                                onChange: ({ value }) =>
                                    !value ? "Category is required" : undefined,
                            }}
                        >
                            {field => (
                                <label className="flex flex-col gap-2">
                                    <span>Category</span>
                                    <input
                                        className="p-4 border border-neutral-900 rounded-[6px]"
                                        value={field.state.value}
                                        onChange={e => field.handleChange(e.target.value)}
                                        placeholder="e.g., Geography"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <span className="text-red-500 text-sm">
                                            {field.state.meta.errors[0]}
                                        </span>
                                    )}
                                </label>
                            )}
                        </form.Field>

                    </div>

                    <button
                        disabled={!form.state.canSubmit}
                        className="flex items-center gap-2 bg-primary rounded-full w-fit py-3 px-4 shadow border border-neutral-900 disabled:opacity-50"
                    >
                        <IconPlus /> Create Card
                    </button>

                </form>

            </main>
        </div>
    );
}
