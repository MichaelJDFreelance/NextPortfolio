"use client"

import {showForm} from "../lib/store/invoiceStore";

export function ActionButtons() {
    return (
        <>
            <button onClick={showForm} className={`px-6 py-4.5 text-muted bg-neutral-100 rounded-full`}>Edit</button>
            <button className={`px-6 py-4.5 bg-destructive rounded-full`}>Delete</button>
            <button className={`px-6 py-4.5 bg-primary rounded-full`}>Mark as Paid</button>
        </>
    );
}