import {Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {dispatchModal, modalStore} from "@/lib/client/modalReducer";
import {useQuery} from "@tanstack/react-query";
import {getPots} from "@/data/server/data-access";
import {useForm} from "@tanstack/react-form";
import {useUpdatePotTotal} from "@/hooks/data/mutations";

export function PotWithdrawModal() {
    const modal = useStore(modalStore)

    const isOpen = modal.type === "withdrawFromPot";

    const editingPotId =
        modal.type === "withdrawFromPot" ? modal.potId : null;

    const {data: pots} = useQuery({
        queryKey: ['pots'],
        queryFn: getPots
    })

    const editingPot =
        editingPotId && pots
            ? pots.find((p) => p.id === editingPotId)
            : null;

    const addToPot = useUpdatePotTotal();

    const form = useForm({
        defaultValues: {amount: 0},
        onSubmit: async ({value}) => {
            if (editingPot) {
                await addToPot.mutateAsync({
                    amount:value.amount*-1,
                    id: editingPot.id,
                });
            }

            dispatchModal({type: "CLOSE"});
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                dispatchModal({ type: "CLOSE" });
            }
        }} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Withdraw</DialogTitle>
                    <DialogDescription>
                        Choose a category to set a spending pot. These categories can help you monitor spending.
                    </DialogDescription>
                </DialogHeader>
                <form className={`flex flex-col gap-4`} onSubmit={e=>{
                    e.preventDefault();
                    form.handleSubmit(e).then()}}>
                    <form.Field name={`amount`}>
                        {field=>(
                            <div>
                                <label>Amount</label>
                                <input  value={field.state.value} type="text"
                                    onChange={(e) => field.handleChange(Number(e.target.value))} />
                            </div>
                        )}
                    </form.Field>
                    <button className={`mt-1`}>Add Pot</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}