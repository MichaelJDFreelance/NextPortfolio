import {DarkModeSwitch} from "@/components/ui/DarkModeSwitch";
import {BoardList} from "@/components/BoardList";

export function Sidebar() {
    return (
        <div className={`sidebar`}>
            <BoardList />
            <DarkModeSwitch />
        </div>
    );
}