import {Store} from "@tanstack/react-store";

type ColumnModalState = {
    open: boolean,
    board?: any
}

export const columnModal = new Store<ColumnModalState>({
    open: false
})

export const closeColumnModal = () => columnModal.setState({open: false})