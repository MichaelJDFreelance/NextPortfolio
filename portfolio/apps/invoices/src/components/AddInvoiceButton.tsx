"use client"

import {showForm} from "../lib/store/invoiceStore";

export function AddInvoiceButton() {
    return (
        <button onClick={showForm} className={`bg-primary text-white`}>New Invoice</button>
    );
}