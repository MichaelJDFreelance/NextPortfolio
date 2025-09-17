"use client"

import modal from "@/lib/ModalReducer";
import {useState} from "react";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
/*import {FONT_STYLES} from "@/app/dictionary/stores/fontStore";*/
import {useStore} from "@tanstack/react-store";
import {getColumns, Task} from "@/store/boardStore";
import {activeBoardStore} from "@/store/activeStore";

export function CardViewModal() {
    const [card, setCard] = useState<Task|null>(null);
    modal.listen({current:"kanban", op:"view"}, setCard)
    const selectedBoard = useStore(activeBoardStore)

    const columns = selectedBoard && getColumns(selectedBoard) || [];

    return (
        <Dialog open={!!card} onOpenChange={()=>modal.close()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{card?.title}</DialogTitle>
                    <DialogDescription>
                        {card?.description}
                    </DialogDescription>
                </DialogHeader>
                {card?.subtasks?.map(stask=>(
                    <div key={stask.id} className={`flex items-center gap-2`}>
                        <input type="checkbox" checked={stask.isCompleted} readOnly />
                        <span>{stask.title}</span>
                    </div>
                ))}
                <Select value={columns[0].name}>
                    <SelectTrigger className="!w-[180px] dark:text-white">
                        <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className={`dark:text-white`}>
                            <div className={`data-[font=serif]:font-serif data-[font=monospace]:font-mono data-[font=sans-serif]:font-sans`}>
                                {Object.values(columns).map((column) => (
                                    <SelectItem
                                        key={column.name}
                                        value={column.name}
                                    >
                                        {column.name}
                                    </SelectItem>
                                ))}
                            </div>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </DialogContent>
        </Dialog>
    );
}