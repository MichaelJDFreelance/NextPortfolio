import { Store } from '@tanstack/react-store'

// Define more specific types for better type safety
type ModalOp = 'edit' | 'delete' | 'add' | 'view' | null

interface ModalState {
    current: string | null
    op: ModalOp
    data: unknown // Using unknown instead of any for better type safety
}

interface ModalAction {
    type: 'OPEN_MODAL' | 'CLOSE_MODAL'
    payload?: {
        current: string
        op: Exclude<ModalOp, null> // Exclude null since we don't need it for opening
        data: unknown
    }
}

// Initial state
const initialState: ModalState = {
    current: null,
    op: null,
    data: null
}

// Create the reducer
function modalReducer(state: ModalState, action: ModalAction): ModalState {
    switch (action.type) {
        case 'OPEN_MODAL':
            if (!action.payload) return state
            return {
                current: action.payload.current,
                op: action.payload.op,
                data: action.payload.data
            }
        case 'CLOSE_MODAL':
            return initialState
        default:
            return state
    }
}

// Create the store with the reducer
const store = new Store<ModalState>(initialState)

// Action creators
const actions = {
    close: (cleanup?:()=>void) => {
        store.setState(() => modalReducer(store.state, { type: 'CLOSE_MODAL' }))
        if (cleanup) cleanup()
    },

    open: (current: string, op: Exclude<ModalOp, null>, data: unknown) => {
        store.setState(() =>
            modalReducer(store.state, {
                type: 'OPEN_MODAL',
                payload: { current, op, data }
            })
        )
    }
}

// Helper type for the filter conditions
interface ModalFilter {
    current?: string
    op?: ModalOp
}

// Enhanced listen function with filtering
const listen = (
    filter: ModalFilter,
    callback: (data: any) => void
) => {
    return store.subscribe((state) => {
        const matchesCurrent = !filter.current || !state.currentVal.current || state.currentVal.current === filter.current;
        const matchesOp = !filter.op || !state.currentVal.op || state.currentVal.op === filter.op;

        if (matchesCurrent && matchesOp) {
            callback(state.currentVal.data);
        }
    });
}


export default { ...actions, listen }
export type { ModalState, ModalOp, ModalFilter }
