"use client"

import {useForm} from "@tanstack/react-form";
import {formService, formStore} from "@/lib/state/formMachine";
import {useStore} from "@tanstack/react-store";

export function PersonalInfo() {
    const snapshot = useStore(formStore, (s) => s.snapshot);

    const form = useForm({
        defaultValues: {
            name: snapshot?.context.personalInfo.name ?? "",
            email: snapshot?.context.personalInfo.email ?? "",
            phone: snapshot?.context.personalInfo.phone ?? "",
        },
        onSubmit: ({value})=>{
            formService.send({
                type: "UPDATE_PERSONAL_INFO",
                values: value,
            });
        }
    });

    return (
        <div className={`flex flex-col gap-10`}>
            <header className={`flex flex-col gap-2`}>
                <h1 className={`text-accent text-preset-1`}>Personal info</h1>
                <p>Please provide your name, email address, and phone number.</p>
                {snapshot?.value==="personalInfoError" && <span role="alert">
                    We couldn’t save your information. Please try again.</span>}
            </header>

            <form className={`flex flex-col gap-6 text-preset-3`} onSubmit={e=>{
                e.preventDefault();
                form.handleSubmit(e).then();
            }}>
                <form.Field name="name" validators={{
                    onSubmit: ({value}) => {
                        if (value.trim() === '') {
                            return 'This field is required';
                        }
                    }
                }} >
                    {field => (
                        <label className={`flex flex-col gap-2 text-foreground`}>
                            <div className={`flex justify-between`}>
                                <span className={`text-accent text-preset-4`}>Name</span>
                                {field.state.meta.errors && <span className={`text-destructive`}>{field.state.meta.errors[0]}</span>}
                            </div>
                            <input value={field.state.value}
                                   onChange={e=>field.handleChange(e.target.value)}
                                className={`rounded px-2 py-4 border`} type="text"
                                   placeholder={`e.g. Stephen King`} />
                        </label>
                    )}
                </form.Field>
                <form.Field name="email" validators={{
                    onSubmit: ({value}) => {
                        if (value.trim() === '') {
                            return 'This field is required';
                        }
                    }
                }} >
                    {field => (
                        <label className={`flex flex-col gap-2 text-foreground`}>
                            <div className={`flex justify-between`}>
                                <span className={`text-accent text-preset-4`}>Email Address</span>
                                {field.state.meta.errors && <span className={`text-destructive`}>{field.state.meta.errors[0]}</span>}
                            </div>
                            <input value={field.state.value}
                                   onChange={e=>field.handleChange(e.target.value)}
                                   className={`rounded px-2 py-4 border`} type="text"
                                   placeholder={`e.g. stephenking@lorem.com`} />
                        </label>
                    )}
                </form.Field>
                <form.Field name="phone" validators={{
                    onSubmit: ({value}) => {
                        if (value.trim() === '') {
                            return 'This field is required';
                        }
                    }
                }} >
                    {field => (
                        <label className={`flex flex-col gap-2 text-foreground`}>
                            <div className={`flex justify-between`}>
                                <span className={`text-accent text-preset-4`}>Phone Number</span>
                                {field.state.meta.errors && <span className={`text-destructive`}>{field.state.meta.errors[0]}</span>}
                            </div>
                            <input value={field.state.value}
                                   onChange={e=>field.handleChange(e.target.value)}
                                   className={`rounded px-2 py-4 border`} type="text"
                                   placeholder={`e.g. +1 234 567 890`} />
                        </label>
                    )}
                </form.Field>
                <button className={`text-preset-3 px-6 py-3.5 rounded bg-accent text-white w-fit ml-auto cursor-pointer`}>
                    Next</button>
            </form>
        </div>
    );
}