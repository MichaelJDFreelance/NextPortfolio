import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {addColumn} from "@/lib/yjs/mutators";
import {useStore} from "@tanstack/react-store";
import {closeColumnModal, columnModal} from "@/lib/store/modalStore";
import * as Y from "yjs";

export function AddColumnModal() {
    const modalInfo = useStore(columnModal);

    const [newColumnName, setNewColumnName] = useState("");

    function handleConfirmAddColumn() {
        const name = newColumnName.trim();
        if (!name) return;
        addColumn(modalInfo.board as Y.Map<any>, name);
        setNewColumnName("");
        closeColumnModal();
    }

    const handleCancel = () => {
        closeColumnModal();
        setNewColumnName("");
    }

    return (
        <Dialog open={modalInfo.open} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new column</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        autoFocus
                        placeholder="Column name"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                    />
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmAddColumn}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}