import {Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {dispatchModal, modalStore} from "@/lib/client/modalReducer";
import {useDeletePot} from "@/hooks/data/mutations";

export function DeletePotModal() {
    const modal = useStore(modalStore)

    const isOpen = modal.type === "deletePot";

    const deletingPotId =
        modal.type === "deletePot" ? modal.potId : null;

    const deletePot = useDeletePot();

    const handleDeletePot = async () => {
        if (!deletingPotId) return;
        await deletePot.mutateAsync(deletingPotId);
        dispatchModal({type: "CLOSE"});
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                dispatchModal({ type: "CLOSE" });
            }
        }} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Pot</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this pot?
                    </DialogDescription>
                </DialogHeader>
                <button onClick={handleDeletePot}>Delete</button>
            </DialogContent>
        </Dialog>
    );
}