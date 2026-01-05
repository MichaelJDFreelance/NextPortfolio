"use client"

import {formService, formStore} from "@/lib/state/formMachine";
import {useForm} from "@tanstack/react-form";
import {useStore} from "@tanstack/react-store";
import {Checkbox} from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";
import {usePricing} from "@/app/hooks/usePricing";

export function AddOns() {
    const snapshot = useStore(formStore, (s) => s.snapshot);

    const form = useForm({
        defaultValues: {
            online: snapshot?.context.addOns.online ?? false,
            largerStorage: snapshot?.context.addOns.largerStorage ?? false,
            customProfile: snapshot?.context.addOns.customProfile ?? false,
        },
        onSubmit: ({value})=>{
            formService.send({
                type: "UPDATE_ADD_ONS",
                values: value,
            });
        }
    });

    const {data} = usePricing();

    const pricing = snapshot?.context.plan.yearly? data?.annual : data?.monthly;

    return (
        <div className={`flex flex-col gap-10`}>
            <header className={`flex flex-col gap-2`}>
                <h1 className={`text-accent text-preset-1`}>Pick add-ons</h1>
                <p>You have the option of monthly or yearly billing.</p>
                {snapshot?.value==="personalInfoError" && <span role="alert">
                    Add-ons help enhance your gaming experience.</span>}
            </header>

            <form className={`flex flex-col gap-6 text-preset-3`} onSubmit={e=>{
                e.preventDefault();
                form.handleSubmit(e).then();
            }}>
                <fieldset className={`flex flex-col gap-4`}>
                    {pricing?.addons?.map(addon=>(
                        <form.Field key={addon.id} name={addon.id} >
                            {field => (
                                <label className={cn("grid grid-cols-[auto_1fr_auto] gap-x-6 items-center border rounded px-6 py-4 cursor-pointer", field.state.value===true&&"bg-muted border-primary")}>
                                    <Checkbox className={`row-span-2`} checked={field.state.value}
                                              onCheckedChange={e=>field.handleChange(e===true)} />
                                    <span>{addon.title}</span>
                                    <span className={`row-span-2`}>+${addon.price}/{pricing.frequency}</span>
                                    <span>{addon.description}</span>
                                </label>
                            )}
                        </form.Field>
                    ))}
                </fieldset>
                <button className={`text-preset-3 px-6 py-3.5 rounded bg-accent text-white w-fit ml-auto cursor-pointer`}>
                    Next</button>
            </form>
        </div>
    );
}