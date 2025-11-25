import {Store} from "@tanstack/react-store";
import data from "../../data/data.json"

type Item = {
    "name": string,
    "quantity": number,
    "price": number,
    "total": number
};

type Invoice = {
    "id": string,
    "createdAt": string,
    "paymentDue": string,
    "description": string,
    "paymentTerms": number,
    "clientName": string,
    "clientEmail": string,
    "status": string,
    "senderAddress": {
        "street": string,
        "city": string,
        "postCode": string,
        "country": string
    },
    "clientAddress": {
        "street": string,
        "city": string,
        "postCode": string,
        "country": string
    },
    "items": Item[],
    "total": number
}

type InvoiceStoreType = {
    invoices: Invoice[],
    showForm:boolean
}

export const InvoiceStore = new Store<InvoiceStoreType>({invoices:data, showForm:false});

export const addInvoice = (invoice:Invoice) => InvoiceStore.setState(s=>({...s, invoices:[...s.invoices, invoice]}))

export const removeInvoice = (id:string) => InvoiceStore.setState(s=>({...s, invoices:s.invoices.filter(i=>i.id !== id)}))

export const updateInvoice = (invoice:Invoice) => InvoiceStore.setState(s=>({...s, invoices:s.invoices.map(i=>i.id === invoice.id ? invoice : i)}))

export const toggleFormVisible = () => {
    InvoiceStore.setState(s=>({...s, showForm:!s.showForm}))
}

export const showForm = () => {
    InvoiceStore.setState(s=>({...s, showForm:true}))
}

export const hideForm = () => {
    InvoiceStore.setState(s=>({...s, showForm:false}))
}
