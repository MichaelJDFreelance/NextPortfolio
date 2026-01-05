import {Store} from "@tanstack/react-store";

export type ModalAction =
    | { type: "OPEN_ADD_BUDGET" }
    | { type: "OPEN_EDIT_BUDGET"; budgetId: string }
    | { type: "OPEN_DELETE_BUDGET"; budgetId: string }
    | { type: "OPEN_ADD_POT" }
    | { type: "OPEN_EDIT_POT"; potId: string }
    | { type: "OPEN_DELETE_POT"; potId: string }
    | { type: "OPEN_ADD_TO_POT"; potId: string }
    | { type: "OPEN_WITHDRAW_FROM_POT"; potId: string }
    | { type: "CLOSE" };

type ModalState =
    | { type: "closed" }
    | { type: "addBudget" }
    | { type: "editBudget"; budgetId: string }
    | { type: "deleteBudget"; budgetId: string }
    | { type: "addPot" }
    | { type: "addToPot"; potId: string }
    | { type: "withdrawFromPot"; potId: string }
    | { type: "editPot"; potId: string }
    | { type: "deletePot"; potId: string };

export const modalStore = new Store<ModalState>({ type: "closed" });

export function dispatchModal(action: ModalAction) {
    modalStore.setState((state) => modalReducer(state, action));
}

function modalReducer(
    _state: ModalState,
    action: ModalAction
): ModalState {
    switch (action.type) {
        case "OPEN_ADD_BUDGET":
            return { type: "addBudget" };

        case "OPEN_EDIT_BUDGET":
            return { type: "editBudget", budgetId: action.budgetId };

        case "OPEN_DELETE_BUDGET":
            return { type: "deleteBudget", budgetId: action.budgetId };

        case "OPEN_ADD_POT":
            return { type: "addPot" };

        case "OPEN_EDIT_POT":
            return { type: "editPot", potId: action.potId };

        case "OPEN_ADD_TO_POT":
            return { type: "addToPot", potId: action.potId };

        case "OPEN_WITHDRAW_FROM_POT":
            return { type: "withdrawFromPot", potId: action.potId };

        case "OPEN_DELETE_POT":
            return { type: "deletePot", potId: action.potId };

        case "CLOSE":
            return { type: "closed" };
    }
}