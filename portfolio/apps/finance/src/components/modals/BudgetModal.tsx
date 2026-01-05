import {Dialog, DialogTitle, DialogHeader, DialogContent, DialogDescription} from "@/components/ui/dialog";
import {useStore} from "@tanstack/react-store";
import {dispatchModal, modalStore} from "@/lib/client/modalReducer";
import {useQuery} from "@tanstack/react-query";
import {getBudgets} from "@/data/server/data-access";
import {useForm} from "@tanstack/react-form";
import {useCreateBudget, useUpdateBudget} from "@/hooks/data/mutations";

export function BudgetModal() {
    const modal = useStore(modalStore)

    const isOpen = modal.type === "addBudget" || modal.type === "editBudget";

    const editingBudgetId =
        modal.type === "editBudget" ? modal.budgetId : null;

    const {data: budgets} = useQuery({
        queryKey: ['budgets'],
        queryFn: getBudgets
    })

    const editingBudget =
        editingBudgetId && budgets
            ? budgets.find((b) => b.id === editingBudgetId)
            : null;

    const createBudget = useCreateBudget();
    const updateBudget = useUpdateBudget();

    const form = useForm({
        defaultValues: editingBudget ? editingBudget : {category: "", maximum: 0, theme: ""},
        onSubmit: async ({value}) => {
            if (editingBudget) {
                await updateBudget.mutateAsync({
                    ...value,
                    id: editingBudget.id,
                });
            } else {
                await createBudget.mutateAsync(value);
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
                    <DialogTitle>{modal.type!=="closed"? editingBudget ? "Edit Budget" : "Add New Budget": ""}</DialogTitle>
                    <DialogDescription>
                        Choose a category to set a spending budget. These categories can help you monitor spending.
                    </DialogDescription>
                </DialogHeader>
                <form className={`flex flex-col gap-4`} onSubmit={e=>{
                    e.preventDefault();
                    form.handleSubmit(e).then()}}>
                    <form.Field name={`category`}>
                        {field=>(
                            <div>
                                <label>Budget Category</label>
                                <input  value={field.state.value} type="text"
                                    onChange={(e) => field.handleChange(e.target.value)} />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name={`maximum`}>
                        {field=>(
                            <div>
                                <label>Maximum Spend</label>
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
                    <button className={`mt-1`}>Add Budget</button>
                </form>
            </DialogContent>
        </Dialog>
    );
}