import {Icon} from "@/components/ui/icon";

export function LogoutButton() {
    return (
        <div className={`flex items-center`}>
            <Icon name={`logout`} /> Logout
        </div>
    );
}