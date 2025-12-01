"use client"

import {ReactNode} from "react";
import {useForm, useStore} from "@tanstack/react-form";
import {addInvoice, InvoiceStore, updateInvoice} from "../lib/store/invoiceStore";
import {useParams} from "next/navigation";

function Field({className, children}: { className?: string, children: ReactNode}) {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {children}
        </div>
    );
}

export function InvoiceForm() {
    const route = useParams()

    const id = route.id as string;
    const invoice = useStore(InvoiceStore, s=>s.invoices.find(i=>i.id === id))

    const form = useForm({
        defaultValues: invoice || {
            "id": "",
            "createdAt": "",
            "paymentDue": "",
            "description": "",
            "paymentTerms": 0,
            "clientName": "",
            "clientEmail": "",
            "status": "",
            "senderAddress": {
                "street": "",
                "city": "",
                "postCode": "",
                "country": ""
            },
            "clientAddress": {
                "street": "",
                "city": "",
                "postCode": "",
                "country": ""
            },
            "items": [
                {
                    "name": "",
                    "quantity": 0,
                    "price": 0,
                    "total": 0
                }
            ],
            "total": 0
        },
        onSubmit: async ({value}) => {
            if (value.id)  updateInvoice(value);
            else addInvoice(value);
        }
    })

    return (
        <form className={`flex flex-col gap-12 py-15 text-muted`}>
            <h2>Edit #XM9141</h2>

            <fieldset className={`grid grid-cols-6 gap-6`}>
                <h3 className={`col-span-6 text-primary font-bold`}>Bill From</h3>
                <form.Field name={`senderAddress.street`}>
                    {field => (
                        <Field className={`col-span-6`}>
                            <label className={`text-destructive`}>Street Address</label>
                            <input placeholder={`123 Main Street`} value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`border px-5 py-4.5 border-primary rounded-[4px] placeholder:text-muted text-neutral-800`} />
                        </Field>
                    )}
                </form.Field>
                <Field className={`col-span-2`}>
                    <label>Street Address</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-2`}>
                    <label>Street Address</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-2`}>
                    <label>Street Address</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
            </fieldset>

            <fieldset className={`grid grid-cols-6 gap-6`}>
                <h3 className={`col-span-6 text-primary font-bold`}>Bill To</h3>
                <form.Field name={`clientName`}>
                    {field => (
                        <Field className={`col-span-6`}>
                            <label>Client’s Name</label>
                            <input placeholder={`123 Main Street`} value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                        </Field>
                    )}
                </form.Field>
                <form.Field name={`clientEmail`}>
                    {field => (
                        <Field className={`col-span-6`}>
                            <label>Client’s Email</label>
                            <input placeholder={`123 Main Street`} value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                        </Field>
                    )}
                </form.Field>
                <form.Field name={`clientAddress.street`}>
                    {field => (
                        <Field className={`col-span-6`}>
                            <label>Street Address</label>
                            <input placeholder={`123 Main Street`}  value={field.state.value}
                                   onChange={(e)=>field.handleChange(e.target.value)}
                                   className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                        </Field>
                    )}
                </form.Field>
                <Field className={`col-span-2`}>
                    <label>City</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-2`}>
                    <label>Post Code</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-2`}>
                    <label>Country</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
            </fieldset>

            <fieldset className={`grid grid-cols-6 gap-6`}>
                <Field className={`col-span-3`}>
                    <label>Invoice Date</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-3`}>
                    <label>Payment Terms</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
                <Field className={`col-span-6`}>
                    <label>Project Description</label>
                    <input placeholder={`123 Main Street`} className={`border px-5 py-4.5 border-primary rounded-[4px]`} />
                </Field>
            </fieldset>

            <button>Save</button>
        </form>
    );
}