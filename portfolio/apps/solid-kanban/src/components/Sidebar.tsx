//import {DarkModeSwitch} from "@/components/ui/DarkModeSwitch";
import {BoardList} from "@/components/BoardList";

export function Sidebar() {
    return (
        <div class={`sidebar`}>
            <BoardList />
           {/* <DarkModeSwitch />*/}
        </div>
    );
}