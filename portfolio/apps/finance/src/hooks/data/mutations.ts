import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    createBudget,
    createPot,
    deleteBudget,
    deletePot,
    updateBudget,
    updatePot,
    updatePotTotal
} from "@/data/server/data-access";

type MutationFn<TVars = unknown, TData = unknown> = (vars: TVars) => Promise<TData>;

export function useInvalidateMutation<TVars, TData>(
    mutationFn: MutationFn<TVars, TData>,
    queryKey: string[]
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });
}

export const useCreatePot = () =>
    useInvalidateMutation(createPot, ["pots"]);

export const useUpdatePot = () =>
    useInvalidateMutation(updatePotTotal, ["pots"]);

export const useUpdatePotTotal = () =>
    useInvalidateMutation(updatePotTotal, ["pots"]);

export const useDeletePot = () =>
    useInvalidateMutation(deletePot, ["pots"]);

export const useCreateBudget = () =>
    useInvalidateMutation(createBudget, ["budgets"]);

export const useUpdateBudget = () =>
    useInvalidateMutation(updateBudget, ["budgets"]);

export const useDeleteBudget = () =>
    useInvalidateMutation(deleteBudget, ["budgets"]);