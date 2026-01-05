"use client"

import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {modalStore} from "@/lib/state/modalStore";
import {useForm} from "@tanstack/react-form";
import {settingsStore} from "@/lib/state/settingsStore";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {cn} from "@/lib/utils";
import IconClose from "@portfolio/icons/pomodoro/icon-close"

export function SettingsModal() {
    const modalOpen = useStore(modalStore);
    const settings = useStore(settingsStore);

    const form = useForm({
        defaultValues: settings,
        onSubmit: ({value}) => {
            settingsStore.setState(value);
            modalStore.setState(false);
        }
    })

    return (
        <Dialog open={modalOpen} onOpenChange={()=>modalStore.setState(false)}>

                <DialogContent className={`m-0 p-0 bg-white rounded-[25px] text-black`} showCloseButton={false}>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        form.handleSubmit(e).then();
                    }} className={`px-10`} >
                        <DialogHeader className={`py-6 text-left border-b relative`}>
                            <DialogTitle className={`text-preset-1`}>Settings</DialogTitle>
                            <DialogClose className={`absolute top-4 -right-4`}><IconClose /></DialogClose>
                        </DialogHeader>
                        <div className={`flex flex-col gap-6 mt-6`}>
                            <fieldset className={`grid grid-cols-3 gap-5`}>
                                <legend  className={`col-span-3 text-preset-2 mb-5`}>TIME (MINUTES)</legend>
                                <form.Field name={`durations.pomodoro`}>
                                    {field=>(
                                        <label className={`flex flex-col gap-1`}>
                                            <span>pomodoro</span>
                                            <input type="number" value={field.state.value} className={`bg-input p-4 rounded-[10px]`}
                                                   onChange={e=>field.handleChange(Number(e.target.value))} />
                                        </label>
                                    )}
                                </form.Field>
                                <form.Field name={`durations.shortBreak`}>
                                    {field=>(
                                        <label className={`flex flex-col gap-1`}>
                                            <span>short break</span>
                                            <input type="number" value={field.state.value} className={`bg-input p-4 rounded-[10px]`}
                                                   onChange={e=>field.handleChange(Number(e.target.value))}/>
                                        </label>
                                    )}
                                </form.Field>
                                <form.Field name={`durations.longBreak`}>
                                    {field=>(
                                        <label className={`flex flex-col gap-1`}>
                                            <span>long break</span>
                                            <input type="number" value={field.state.value} className={`bg-input p-4 rounded-[10px]`}
                                                   onChange={e=>field.handleChange(Number(e.target.value))}/>
                                        </label>
                                    )}
                                </form.Field>
                            </fieldset>
                            <hr />
                            <form.Field name={`font`}>
                                {field=>(
                                    <label className={`flex items-center justify-between`}>
                                        <span className={`text-preset-2`}>FONT</span>
                                        <RadioGroup orientation="horizontal" value={field.state.value} onValueChange={e=>field.handleChange(e)} className={`flex`}>
                                            <RadioGroupItem invisibleIndicator={true}
                                                            className={cn("font-sans h-10 w-10", field.state.value === "sans" ? "bg-black text-white" : "")}
                                                            value={"sans"}>Aa</RadioGroupItem>
                                            <RadioGroupItem invisibleIndicator={true}
                                                            className={cn("font-sans h-10 w-10", field.state.value === "serif" ? "bg-black text-white" : "")}
                                                            value={"serif"}>Aa</RadioGroupItem>
                                            <RadioGroupItem invisibleIndicator={true}
                                                            className={cn("font-sans h-10 w-10", field.state.value === "mono" ? "bg-black text-white" : "")}
                                                            value={"mono"}>Aa</RadioGroupItem>
                                        </RadioGroup>
                                    </label>
                                )}
                            </form.Field>
                            <hr />
                            <form.Field name={`theme`}>
                                {field=>(
                                    <label className={`flex items-center justify-between`}>
                                        <span className={`text-preset-2`}>COLOR</span>
                                        <RadioGroup orientation="horizontal" value={field.state.value} onValueChange={e=>field.handleChange(e)} className={`flex`}>
                                            <RadioGroupItem className={`bg-theme h-10 w-10 orange-theme`} value={"orange"}></RadioGroupItem>
                                            <RadioGroupItem className={"bg-theme h-10 w-10 red-theme"} value={"red"}></RadioGroupItem>
                                            <RadioGroupItem className={"bg-theme h-10 w-10 hotpink-theme"} value={"hotpink"}></RadioGroupItem>
                                        </RadioGroup>
                                    </label>
                                )}
                            </form.Field>
                        </div>
                        <DialogFooter className={`mt-8 -mb-8`}>
                            <button  className={`bg-red-500 w-fit px-12 py-5 rounded-full text-white mx-auto`}>Apply</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
        </Dialog>
    );
}