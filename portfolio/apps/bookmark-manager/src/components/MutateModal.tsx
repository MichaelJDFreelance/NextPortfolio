"use client"

import {Dialog, DialogContent} from "@/components/ui/dialog";
import {mutateStore} from "@/lib/store/mutateStore";
import {useStore} from "@tanstack/react-store";
import {bookmarkStore} from "@/lib/store/bookmarkStore";

export function MutateModal() {
    const mutate = useStore(mutateStore);
    const bookmarks = useStore(bookmarkStore, (val)=>val.bookmarks)

    const updateMutate = () => {
        mutateStore.setState(prev=>({
            id: undefined,
            state: `closed`
        }))
    }

    return (
        <Dialog open={mutate?.state===`open`} onOpenChange={updateMutate} >
            <DialogContent>
                <div>
                    {bookmarks?.find(bookmark=>bookmark.id===mutate?.id)?.title}
                </div>
            </DialogContent>
        </Dialog>
    );
}