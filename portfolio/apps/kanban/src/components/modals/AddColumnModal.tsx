import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {addColumn} from "@/lib/yjs/mutators";
import {useStore} from "@tanstack/react-store";
import * as Y from "yjs";
import {uiService, uiStore} from "@/lib/store/uiMachine";
import {getBoardById} from "@/lib/yjs/accessors";

export function ModalHost() {
    const ui = useStore(uiStore);

    const modal = ui.snapshot?.context.modal;
    const payload = ui.snapshot?.context.modalPayload;

    if (!modal) return null;

    switch (modal) {
        case "addColumn":
            return <AddColumnModal payload={payload} />;

        // FUTURE:
        // case "editTask":
        //   return <EditTaskModal payload={payload} />;

        default:
            return null;
    }
}

export function AddColumnModal({ payload }: { payload: any }) {
    const ui = useStore(uiStore);

    const boardId = payload?.boardId;  // or payload.board if you store the actual Y.Map
    const yBoard = boardId ? getBoardById(boardId) : payload?.board;

    const [name, setName] = useState("");

    const close = () => {
        uiService.send({type: "CLOSE_MODAL"});
        setName("");
    };

    const handleConfirm = () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        // expect that payload.board or your board lookup is used
        addColumn(yBoard as Y.Map<any>, trimmed);

        close();
    };

    const isOpen = ui.snapshot?.matches({modal: "open"}) &&
        ui.snapshot?.context.modal === "addColumn";

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new column</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        autoFocus
                        placeholder="Column name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={close}>Cancel</Button>
                    <Button onClick={handleConfirm}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}