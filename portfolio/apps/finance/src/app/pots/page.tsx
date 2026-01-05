"use client"

import {formatAsDollars, formatAsPercentage} from "@/lib/utils";
import {CSSProperties} from "react";
import {getPots} from "@/data/server/data-access";
import {useQuery} from "@tanstack/react-query";
import {LabeledModalAction, ModalActionDropdown} from "@/components/modals/ModalActionDropdown";
import {Progress} from "@/components/ui/progress";
import {PotModal} from "@/components/modals/PotModal";
import {dispatchModal} from "@/lib/client/modalReducer";
import {DeletePotModal} from "@/components/modals/DeletePotModal";
import {PotAddMoneyModal} from "@/components/modals/PotAddMoneyModal";
import {PotWithdrawModal} from "@/components/modals/PotWithdrawModal";

export default function Page() {
    const {data: pots} = useQuery({
        queryKey: ['pots'],
        queryFn: getPots,
    })

    const getActions = (id:string): LabeledModalAction[] => {
        return [
            { type: "OPEN_EDIT_POT", potId: id, label:"Edit" },
            { type: "OPEN_DELETE_POT", potId: id, label:"Delete" }
        ]
    }

    return (
        <div className="flex mb-auto text-preset-4 w-full">
            <main className="flex gap-8 w-full flex-col px-4 py-6 md:px-8 md:py-10">
                <header className={`flex items-center justify-between`}>
                    <h1 className={`text-preset-1`}>Pots</h1>
                    <button onClick={() => dispatchModal({type: "OPEN_ADD_POT"})}
                        className={`p-4 rounded bg-accent text-accent-foreground`}>+ Add New Pot</button>
                </header>
                <ul className={`grid grid-cols-1 gap-8 lg:grid-cols-2`}>
                    {pots?.map(p=>(
                        <li key={p.id} className={`p-6 rounded flex flex-col gap-8 bg-card text-preset-4 text-card-foreground`}>
                            <header className={`flex items-center gap-4
                            before:content-[''] before:h-4 before:w-4 before:rounded-full before:bg-theme`}
                                    style={{"--theme": p.theme} as CSSProperties}>
                                <h2 className={`text-preset-2 text-accent`}>{p.name}</h2>
                                <ModalActionDropdown actions={getActions(p.id)} />

                            </header>
                            <section className={`flex flex-col gap-3`}>
                                <header className={`mb-1 flex items-center justify-between`}>
                                    <h3 className={``}>Total Saved</h3>
                                    <p className={`text-preset-1 text-accent`}>{formatAsDollars(p.total)}</p>
                                </header>
                                <div style={{"--primary":p.theme} as CSSProperties} >
                                    <Progress value={p.total/p.target*100} indicatorClassName={`rounded-full`}
                                              className={`h-2 rounded-full bg-background`} />
                                </div>
                                <footer className={`mb-1 flex items-center justify-between text-preset-5`}>
                                    <h3 className={`font-bold`}>{formatAsPercentage(p.total/p.target)}</h3>
                                    <p className={``}>Target of {formatAsDollars(p.target)}</p>
                                </footer>
                            </section>
                            <div className={`flex gap-4 text-accent font-bold`}>
                                <button onClick={() => dispatchModal({ type: "OPEN_ADD_TO_POT", potId: p.id })}
                                        className={`flex-1 bg-background p-4 rounded`}>
                                    + Add Money</button>
                                <button onClick={() => dispatchModal({ type: "OPEN_WITHDRAW_FROM_POT", potId: p.id })}
                                        className={`flex-1 bg-background p-4 rounded`}>
                                    Withdraw</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
            <PotModal />
            <DeletePotModal />
            <PotAddMoneyModal />
            <PotWithdrawModal />
        </div>
    );
}
