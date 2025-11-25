"use client"

import {useForm} from "@tanstack/react-form";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {FormEvent, useState} from "react";
import CalculatorIcon from "@/icons/icon-calculator.svg";
import Image from "next/image";

export type MortgageType = "repayment" | "interest";

type Calculation = {
    monthly: number;
    total: number;
} | undefined

export interface MortgageInput {
    amount: number | string;   // principal
    rate: number | string;     // annual interest rate (%)
    term: number | string;     // years
    type: MortgageType;
}

export interface MortgageResult {
    monthly: number;
    total: number;
    interest: number;
}

export function calculateMortgage({
                                      amount,
                                      rate,
                                      term,
                                      type,
                                  }: MortgageInput): MortgageResult {
    amount = parseFloat(amount.toString());
    rate = parseFloat(rate.toString());
    term = parseFloat(term.toString());

    const principal = amount;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = term * 12;

    if (type === "interest") {
        // Interest-only mortgage: pay interest monthly, principal at end
        const monthly = principal * monthlyRate;
        const total = monthly * totalMonths;
        return {
            monthly,
            total,
            interest: total, // full total is interest only (principal repaid separately)
        };
    }

    // Repayment mortgage: compound interest and capital repayment
    if (monthlyRate === 0) {
        // Zero interest case (avoid division by zero)
        const monthly = principal / totalMonths;
        return {
            monthly,
            total: principal,
            interest: 0,
        };
    }

    const monthly =
        (principal *
            (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const total = monthly * totalMonths;
    const interest = total - principal;

    return {
        monthly,
        total,
        interest,
    };
}

export default function Page() {
    const [calculation, setCalculation] = useState<Calculation>(undefined);

    const form = useForm({
        defaultValues: {
            amount: "",
            term: "",
            rate:"",
            type:undefined as MortgageType | undefined,
        },
        onSubmit: async ({value}) => {
            /*alert(JSON.stringify(value))
            const formData = new FormData()
            for (const [key, val] of Object.entries(value)) {
                formData.append(key, String(val))
            }
            await submitContact(formData)*/
            const {amount, rate, term, type} = value;
            if (type) {
                const {interest, ...state} = calculateMortgage({amount, rate, term, type});
                setCalculation(state);
            }

            console.log(value);
        },
    })

    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.handleSubmit(e);
    }

    const handleClear = () => {
        form.reset();
        setCalculation(undefined)
    }

    return (
        <div className={`font-sans min-h-screen bg-background min-w-screen mortgage-calculator flex items-center justify-center`}>
            <main>
                <article className={`flex max-md:flex-col bg-card rounded-lg`}>
                    <form onSubmit={handleSubmit} className={`grid grid-cols-2 gap-6 p-10`}>
                        <header className={`flex items-center justify-between mb-2 col-span-2`}>
                            <h1 className={`text-hard mc-text-preset-2`}>Mortgage Calculator</h1>
                            <button className={`text-medium underline text-preset-4`} onClick={handleClear}>Clear All</button>
                        </header>
                        <form.Field name={`amount`} validators={{
                            onChange: ({ value }) =>
                                (value && (isNaN(Number(value)) || Number(value) <= 0))
                                    ? "Enter a valid amount greater than 0"
                                    : undefined,
                            onSubmit: ({ value }) =>
                                !value
                                    ? "Enter a valid amount greater than 0"
                                    : undefined,
                        }} >
                            {(field) => (
                                <div data-error={!!field.state.meta.errors[0]} className={`group field flex flex-col 
                                gap-3 col-span-2`}>
                                    <label htmlFor={`mortgage-amount`} className={`cursor-pointer text-medium mc-text-preset-4`}>
                                        Mortgage Amount</label>
                                    <label className={`hover:border-slate-900 group-data-[error=true]:!border-red-500 
                                    cursor-pointer input-wrapper border flex flex-row-reverse rounded-sm has-[:focus]:border-primary`}>
                                        <input value={field.state.value}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               id={`mortgage-amount`} type={`text`} placeholder={`Enter amount`}
                                               className={`outline-0 cursor-pointer px-4 peer flex-1`} />
                                        <div className={`rounded-l-sm py-3 px-6 bg-background peer-focus:bg-primary 
                                        group-data-[error=true]:!bg-red-500 group-data-[error=true]:!text-white`}>£</div>
                                    </label>
                                    {field.state.meta.errors[0] && (
                                        <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                        <form.Field name={`term`} validators={{
                            onChange: ({ value }) =>
                                (value && (isNaN(Number(value)) || Number(value) <= 0))
                                    ? "Enter a valid term greater than 0"
                                    : undefined,
                            onSubmit: ({ value }) =>
                                !value
                                    ? "Enter a valid amount greater than 0"
                                    : undefined,
                        }}>
                            {(field) => (
                                <div data-error={!!field.state.meta.errors[0]}  className={`group field flex flex-col gap-3`}>
                                    <label htmlFor={`mortgage-term`} className={`group cursor-pointer text-medium 
                                    mc-text-preset-4`}>Mortgage Term</label>
                                    <label className={`group-data-[error=true]:!border-red-500 hover:border-slate-900 
                                    cursor-pointer input-wrapper border flex rounded-sm`}>
                                        <input value={field.state.value}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               id={`mortgage-term`} type={`text`} placeholder={`Enter amount`}
                                               className={`outline-0 cursor-pointer px-4 flex-1 peer`} />
                                        <div className={`rounded-r-sm py-3 px-6 bg-background peer-focus:bg-primary 
                                        group-data-[error=true]:!bg-red-500 group-data-[error=true]:text-white`}>years</div>
                                    </label>
                                    {field.state.meta.errors[0] && (
                                        <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                        <form.Field name={`rate`} validators={{
                            onChange: ({ value }) =>
                                (value && (isNaN(Number(value)) || Number(value) <= 0))
                                    ? "Enter a valid rate greater than 0"
                                    : undefined,
                            onSubmit: ({ value }) =>
                                !value
                                    ? "Enter a valid amount greater than 0"
                                    : undefined,
                        }}>
                            {(field) => (
                                <div data-error={!!field.state.meta.errors[0]} className={`group field flex flex-col gap-3`}>
                                    <label htmlFor={`interest-rate`} className={`cursor-pointer text-medium mc-text-preset-4`}>
                                        Interest Rate</label>
                                    <label className={`group-data-[error=true]:border-red-500 hover:border-slate-900 
                                    cursor-pointer input-wrapper border flex rounded-sm`}>
                                        <input value={field.state.value}
                                               onChange={e=>field.handleChange(e.target.value)}
                                               id={`interest-rate`} type={`text`} placeholder={`Enter amount`}
                                               className={`outline-0 cursor-pointer px-4 flex-1 peer`} />
                                        <div className={`rounded-r-sm py-3 px-6 bg-background peer-focus:bg-primary 
                                        group-data-[error=true]:bg-red-500 group-data-[error=true]:text-white`}>%</div>
                                    </label>
                                    {field.state.meta.errors[0] && (
                                        <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                        <form.Field name={`type`} validators={{
                            onChange: ({ value }) =>
                                value && value !== "interest" && value !== "repayment"
                                    ? "Select a valid mortgage type"
                                    : undefined,
                            onSubmit: ({ value }) =>
                                !value
                                    ? "Enter a valid amount greater than 0"
                                    : undefined,
                        }}>
                            {(field) => (
                                <div className={`field flex flex-col col-span-2 gap-3`}>
                                    <label htmlFor={`mortgage-type`} className={`cursor-pointer text-medium mc-text-preset-4`}>
                                        Mortgage Type</label>
                                    <RadioGroup id={`mortgage-type`} defaultValue="comfortable"
                                                className={`flex max-md:flex-col gap-4 md:col-span-2`}
                                                value={field.state.value} onValueChange={val=>field.handleChange(val as MortgageType)}>
                                        <label data-error={field.state.meta.errors.length>0} className="cursor-pointer
                                        flex items-center gap-3 !flex-1 border py-3 px-6 rounded-sm field">
                                            <RadioGroupItem value="repayment" id="r1" />
                                            <span>Repayment</span>
                                        </label>
                                        <label data-error={field.state.meta.errors.length>0} className="cursor-pointer
                                        flex items-center gap-3 !flex-1 border py-3 px-6 rounded-sm field">
                                            <RadioGroupItem value="interest" id="r2" />
                                            <span>Interest Only</span>
                                        </label>
                                    </RadioGroup>
                                    {field.state.meta.errors[0] && (
                                        <p className="text-red-500 text-sm">{field.state.meta.errors[0]}</p>
                                    )}
                                </div>
                            )}
                        </form.Field>
                        <button className={`flex-nowrap text-nowrap repayment-button cursor-pointer mt-4 flex items-center 
                        justify-center gap-3 mc-text-preset-3 bg-primary rounded-full py-5 px-10`}>
                            <CalculatorIcon /> Calculate Repayments</button>
                    </form>
                    {calculation ? (
                        <section className={`rounded-lg rounded-bl-[80px] mc-text-preset-4 flex flex-col gap-10 p-10 
                        bg-slate-900 text-white`}>
                            <header className={`flex flex-col gap-4`}>
                                <h2 className={`mc-text-preset-2`}>Your results</h2>
                                <p className={`text-soft max-w-[37ch]`}>
                                    Your results are shown below based on the information you provided. To adjust the
                                    results,
                                    edit the form and click “calculate repayments” again.
                                </p>
                            </header>
                            <div>
                                <div className={`rounded-[8px] h-[4px] border-t-8 border-primary`}>
                                </div>
                                <dl className={`flex flex-col gap-8 bg-black/25 p-8 rounded-md rounded-t-none`}>
                                    <div className={`flex flex-col gap-2`}>
                                        <dt className={`text-soft`}>Your monthly repayments</dt>
                                        <dd className={`text-primary mc-text-preset-1`}>£{calculation.monthly}</dd>
                                    </div>
                                    <hr />
                                    <div className={`flex flex-col gap-2`}>
                                        <dt className={`text-soft`}>Total you&#39;ll repay over the term</dt>
                                        <dd className={`mc-text-preset-2`}>£{calculation.total}</dd>
                                    </div>
                                </dl>
                            </div>

                        </section>
                    ): <section className={`rounded-lg rounded-bl-[80px] mc-text-preset-4 flex flex-col gap-10 p-10 
                    bg-slate-900 text-white`}>
                        <header className={`flex flex-col gap-4 items-center justify-center h-full text-center`}>
                            <Image src="/mortgage-calculator/images/illustration-empty.svg" alt={`mortgage calculator`}
                                   width={100} height={100} />
                            <h2 className={`mc-text-preset-2 text-white`}>Results shown here</h2>
                            <p className={`mc-text-preset-4 text-soft max-w-[40ch]`}>
                                Complete the form and click “calculate repayments” to see what your monthly repayments
                                would be.
                            </p>
                        </header>
                    </section>}
                </article>
            </main>
        </div>
    );
}