import {Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {dispatchModal, modalStore} from "@/lib/client/modalReducer";
import {useQuery} from "@tanstack/react-query";
import {getPots} from "@/data/server/data-access";
import {useForm} from "@tanstack/react-form";
import {useCreatePot, useUpdatePot} from "@/hooks/data/mutations";

export function PotModal() {
    const modal = useStore(modalStore)

    const isOpen = modal.type === "addPot" || modal.type === "editPot";

    const editingPotId =
        modal.type === "editPot" ? modal.potId : null;

    const {data: pots} = useQuery({
        queryKey: ['pots'],
        queryFn: getPots
    })

    const editingPot =
        editingPotId && pots
            ? pots.find((p) => p.id === editingPotId)
            : null;

    const createPot = useCreatePot();
    const updatePot = useUpdatePot();

    const form = useForm({
        defaultValues: editingPot ? editingPot : {name: "", target: 0, total: 0, theme: ""},
        onSubmit: async ({value}) => {
            if (editingPot) {
                await updatePot.mutateAsync({
                    ...value,
                    id: editingPot.id,
                });
            } else {
                await createPot.mutateAsync(value);
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
                    <DialogTitle>{modal.type!=="closed"? editingPot ? "Edit Pot" : "Add New Pot": ""}</DialogTitle>
                    <DialogDescription>
                        Choose a category to set a spending pot. These categories can help you monitor spending.
                    </DialogDescription>
                </DialogHeader>
                <form className={`flex flex-col gap-4`} onSubmit={e=>{
                    e.preventDefault();
                    form.handleSubmit(e).then()}}>
                    <form.Field name={`name`}>
                        {field=>(
                            <div>
                                <label>Pot Name</label>
                                <input  value={field.state.value} type="text"
                                    onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name={`target`}>
                        {field=>(
                            <div>
                                <label>Pot Target</label>
                                <input value={field.state.value} type="number"
                                       onChange={(e) => field.handleChange(Number(e.target.value))}/>
                            </div>
                            )}
                    </form.Field>
                    <form.Field name={`theme`}>
                        {field=>(
                            <div>
                                <label>Theme</label>
                                <input value={field.state.value} type="text"
                                       onChange={(e) => field.handleChange(e.target.value)}/>
                            </div>
                        )}
                    </form.Field>
                    <button className={`mt-1`}>Add Pot</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}