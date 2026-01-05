import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {cn} from "@/lib/utils";
import {Duration, durationStore, settingsStore} from "@/lib/state/settingsStore";
import {useStore} from "@tanstack/react-store";

export function DurationSelect() {
    const duration = useStore(durationStore);
    const theme = useStore(settingsStore, (val)=>val.theme);

    return (
        <div data-theme={theme} className={`flex justify-center p-2 bg-accent rounded-full text-preset-4-mobile md:text-preset-4`}>
            <RadioGroup orientation="horizontal" value={duration} onValueChange={e=>durationStore.setState(e as Duration)} className={`flex gap-0`}>
                <RadioGroupItem invisibleIndicator={true}
                                className={cn("px-5 size-max aspect-auto flex items-center justify-center py-4 border-0", duration === "pomodoro" ? "bg-theme text-black" : "text-white")}
                                value={"pomodoro"}>pomodoro</RadioGroupItem>
                <RadioGroupItem invisibleIndicator={true}
                                className={cn("px-5 size-max aspect-auto flex items-center justify-center py-4 border-0", duration === "shortBreak" ? "bg-theme text-black" : "text-white")}
                                value={"shortBreak"}>short break</RadioGroupItem>
                <RadioGroupItem invisibleIndicator={true}
                                className={cn("px-5 size-max aspect-auto flex items-center justify-center py-4 border-0", duration === "longBreak" ? "bg-theme text-black" : "text-white")}
                                value={"longBreak"}>long break</RadioGroupItem>
            </RadioGroup>
        </div>
    );
}