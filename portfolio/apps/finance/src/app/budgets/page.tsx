"use client"

import {CSSProperties, Fragment} from "react";
import {asDate, formatAsDollars, getTotal} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {getBudgets, getTransactionsByCategory} from "@/data/server/data-access";
import {BudgetModal} from "@/components/modals/BudgetModal";
import {dispatchModal} from "@/lib/client/modalReducer";
import {Progress} from "@/components/ui/progress";
import SimplePieChart from "@/components/charts/Pie";
import {LabeledModalAction, ModalActionDropdown} from "@/components/modals/ModalActionDropdown";
import {DeleteBudgetModal} from "@/components/modals/DeleteBudgetModal";

export default function Page() {
    const {data: transactionsByCategory, isLoading:isTBCLoading} = useQuery({
        queryKey: ['transactionsByCategory'],
        queryFn: getTransactionsByCategory,
    })

    const {data: budgets, isLoading:isBudgetsLoading} = useQuery({
        queryKey: ['budgets'],
        queryFn: getBudgets,
    })

    const getActions = (id:string): LabeledModalAction[] => {
        return [
            { type: "OPEN_EDIT_BUDGET", budgetId: id, label:"Edit" },
            { type: "OPEN_DELETE_BUDGET", budgetId: id, label:"Delete" }
        ]
    }

    if (isTBCLoading || isBudgetsLoading) return (<>Loading</>)

    return (
        <div className="flex mb-auto w-full">
            <main className="flex gap-8 w-full flex-col px-4 py-6 md:px-8 md:py-10">
                <header className={`flex items-center justify-between`}>
                    <h1 className={`text-preset-1`}>Budgets</h1>
                    <button onClick={() => dispatchModal({type: "OPEN_ADD_BUDGET"})} className={`p-4 rounded bg-accent text-accent-foreground`}>+ Add New Budget</button>
                </header>
                <section className={`flex max-xl:flex-col w-full gap-6`}>
                    <article className={`flex-1 p-8 rounded bg-card  px-5 py-6 md:p-8 flex flex-col gap-5 h-fit`}>
                        <header className={`flex justify-between items-center`}>
                            <h2 className={`text-preset-2 text-accent`}>Budgets</h2>
                            <a>See Details</a>
                        </header>
                        <section className={`flex`}>
                            <SimplePieChart data={budgets??[]} />
                            <div className={`ml-auto flex flex-col gap-4`}>
                                {budgets?.map((b)=>(
                                    <div key={b.id} className={`relative pl-4 
                                    before:content-[''] before:w-1 before:absolute before:inset-y-0 before:left-0 before:bg-theme`}
                                         style={{"--theme": b.theme} as CSSProperties}>
                                        <dt className={`text-preset-5`}>{b.category}</dt>
                                        <dd className={`text-accent font-bold`}>{formatAsDollars(b.maximum, {wholeOnly:true})}</dd>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </article>
                    <ul className={`flex-1 flex flex-col gap-6`}>
                        { budgets?.map(b=>{
                            const spent = getTotal(transactionsByCategory?.[b.category]?.map(t => t.amount))
                            const remaining = b.maximum - spent;
                            return (
                                (
                                    <li key={b.id} className={`text-preset-4 flex flex-col gap-5 bg-white rounded p-8`} style={{"--primary": b.theme} as CSSProperties}>
                                        <header className={`flex items-center gap-4
                                        before:content-[''] before:h-4 before:w-4 before:rounded-full before:bg-primary`}>
                                            <h2 className={`text-preset-2 text-accent`}>{b.category}</h2>
                                            <ModalActionDropdown actions={getActions(b.id)} />
                                        </header>
                                        <div className={`flex flex-col gap-4`}>
                                            <h3>Maximum of {formatAsDollars(b.maximum)}</h3>

                                            <div className={`p-1 bg-background rounded-[4px]`}>
                                                <Progress value={Math.abs(spent)/b.maximum*100} className={`h-6 rounded-[4px] bg-background`} />
                                            </div>

                                            <dl className={`flex`}>
                                                <div className={`flex-1 pl-4 border-l-4 border-primary`}>
                                                    <dt className={`text-preset-5`}>Spent</dt>
                                                    <dd className={`text-accent font-bold`}>{formatAsDollars(spent, {asAbsolute:true})}</dd>
                                                </div>
                                                <div className={`flex-1 pl-4 border-l-2`}>
                                                    <dt className={`text-preset-5`}>Remaining</dt>
                                                    <dd className={`text-accent font-bold`}>{formatAsDollars(remaining)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div className={`bg-background p-5 rounded`}>
                                            <h3 className={`text-preset-3 text-accent`}>Latest Spending</h3>
                                            {transactionsByCategory?.[b.category]?.slice(0,5).map(
                                                (t,i)=>(
                                                    <Fragment key={t.id}>
                                                        <hr className={`${i===0?"hidden":""} h-px opacity-15`} />
                                                        <div className={`flex items-center gap-4 p-4 text-preset-4 text-card-foreground`}>
                                                            <img alt={``} src={t.avatar} className={`h-10 w-10 rounded-full`} />
                                                            <span className={`font-bold text-accent`}>{t.name}</span>
                                                            <div className={`flex flex-col ml-auto text-right`}>
                                                                <span className={`font-bold`}>{formatAsDollars(t.amount, {asAbsolute:true})}</span>
                                                                <span className={`text-preset-5 font-normal`}>{asDate(t.date)}</span>
                                                            </div>
                                                        </div>
                                                    </Fragment>
                                                )
                                            )}
                                        </div>
                                    </li>
                                )
                            )
                        })}
                    </ul>
                </section>
            </main>
            <BudgetModal />
            <DeleteBudgetModal />
        </div>
    );
}