import {Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {dispatchModal, modalStore} from "@/lib/client/modalReducer";
import {useDeleteBudget} from "@/hooks/data/mutations";

export function DeleteBudgetModal() {
    const modal = useStore(modalStore)

    const isOpen = modal.type === "deleteBudget";

    const deletingBudgetId =
        modal.type === "deleteBudget" ? modal.budgetId : null;

    const deleteBudget = useDeleteBudget();

    const handleDeleteBudget = async () => {
        if (!deletingBudgetId) return;
        await deleteBudget.mutateAsync(deletingBudgetId);
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
                    <DialogTitle>Delete Budget</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this budget?
                    </DialogDescription>
                </DialogHeader>
                <button onClick={handleDeleteBudget}>Delete</button>
            </DialogContent>
        </Dialog>
    );
}