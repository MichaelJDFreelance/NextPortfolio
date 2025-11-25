import {DarkModeSwitch} from "@/components/DarkModeSwitch";
import {BoardList} from "@/components/BoardList";

export function Sidebar() {
    return (
        <div className={`sidebar`}>
            <BoardList />
        </div>
    );
}