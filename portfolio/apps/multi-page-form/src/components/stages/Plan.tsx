"use client"

import {useStore} from "@tanstack/react-store";
import {formService, formStore} from "@/lib/state/formMachine";
import {useForm} from "@tanstack/react-form";
import {Switch} from "@/components/ui/switch";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import IconArcade from "@portfolio/icons/multi-page-form/icon-arcade"
import IconAdvanced from "@portfolio/icons/multi-page-form/icon-advanced"
import IconPro from "@portfolio/icons/multi-page-form/icon-pro"
import {cn} from "@/lib/utils";
import {usePricing} from "@/app/hooks/usePricing";

export function Plan() {
    const snapshot = useStore(formStore, (s) => s.snapshot);

    const form = useForm({
        defaultValues: {
            yearly: snapshot?.context.plan.yearly ?? false,
            type: snapshot?.context.plan.type ?? "",
        },
        onSubmit: ({value})=>{
            formService.send({
                type: "UPDATE_PLAN",
                values: value,
            });
        }
    });

    const yearly = useStore(form.store, (s) => s.values.yearly);

    const {data} = usePricing();

    const pricing = yearly?data?.annual : data?.monthly;

    return (
        <div className={`flex flex-col gap-10`}>
            <header className={`flex flex-col gap-2`}>
                <h1 className={`text-accent text-preset-1`}>Select your plan</h1>
                <p>You have the option of monthly or yearly billing.</p>
                {snapshot?.value==="personalInfoError" && <span role="alert">
                    We couldn’t save your information. Please try again.</span>}
            </header>

            <form className={`flex flex-col gap-6 text-preset-3`} onSubmit={e=>{
                e.preventDefault();
                form.handleSubmit(e).then();
            }}>
                <form.Field name="type" >
                    {field => (
                        <RadioGroup value={field.state.value} onValueChange={e=>field.handleChange(e)}
                            className={`grid md:grid-cols-3 min-h-40 md:min-w-112.5 text-preset-4`}>
                            <label className={cn(`flex max-md:gap-4 md:flex-col md:justify-between p-4 rounded border`, field.state.value==="arcade"&&"bg-muted border-primary")}>
                                <RadioGroupItem className={`h-fit w-fit border-0`} value={`arcade`} invisibleIndicator={true} ><IconArcade className={`h-10 w-10`} /></RadioGroupItem>
                                <dl className={`flex flex-col`}>
                                    <dt className={`text-preset-3 text-accent`}>Arcade</dt>
                                    <dd>${pricing?.plans?.[0].price}/{pricing?.frequency}</dd>
                                </dl>
                            </label>
                            <label className={cn(`flex max-md:gap-4 md:flex-col md:justify-between p-4 rounded border`, field.state.value==="advanced"&&"bg-muted border-primary")}>
                                <RadioGroupItem className={`h-fit w-fit border-0`} value={`advanced`} invisibleIndicator={true} ><IconAdvanced className={`h-10 w-10`} /></RadioGroupItem>
                                <dl className={`flex flex-col`}>
                                    <dt className={`text-preset-3 text-accent`}>Advanced</dt>
                                    <dd>${pricing?.plans?.[1].price}/{pricing?.frequency}</dd>
                                </dl>
                            </label>
                            <label className={cn(`flex max-md:gap-4 md:flex-col md:justify-between p-4 rounded border`, field.state.value==="pro"&&"bg-muted border-primary")}>
                                <RadioGroupItem className={`h-fit w-fit border-0`} value={`pro`} invisibleIndicator={true} ><IconPro className={`h-10 w-10`} /></RadioGroupItem>
                                <dl className={`flex flex-col`}>
                                    <dt className={`text-preset-3 text-accent`}>Pro</dt>
                                    <dd>${pricing?.plans?.[2].price}/{pricing?.frequency}</dd>
                                </dl>
                            </label>
                        </RadioGroup>
                    )}
                </form.Field>
                <form.Field name="yearly" >
                    {field => (
                        <label className={`p-4 flex gap-2 text-foreground w-full justify-center items-center gap-6 bg-muted rounded`}>
                            Monthly <Switch checked={field.state.value||false} onCheckedChange={e=>field.handleChange(e)} /> Yearly
                        </label>
                    )}
                </form.Field>
                <button className={`text-preset-3 px-6 py-3.5 rounded bg-accent text-white w-fit ml-auto cursor-pointer`}>
                    Next</button>
            </form>
        </div>
    );
}