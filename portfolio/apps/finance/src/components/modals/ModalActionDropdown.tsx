import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import IconEllipsis from "@portfolio/icons/finance/icon-ellipsis";
import {dispatchModal, ModalAction} from "@/lib/client/modalReducer";
import {useState} from "react";

export type LabeledModalAction = ModalAction & { label: string };

export function ModalActionDropdown({actions}:{actions:LabeledModalAction[]}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className={`ml-auto cursor-pointer`}>
                <IconEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {actions.map(action => (
                    <DropdownMenuItem key={action.type}
                        onSelect={(e) => {
                            e.preventDefault();
                            setIsOpen(false)
                            requestAnimationFrame(() => {
                                dispatchModal(action);
                            });
                        }}
                    >
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}