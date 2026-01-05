"use client"

import IconCorrect from "@portfolio/icons/quiz/icon-correct";
import IconInorrect from "@portfolio/icons/quiz/icon-incorrect";
import {Progress} from "@/components/ui/progress";
import {Switch} from "@/components/ui/switch";
import {useState} from "react";
import {Header} from "@/components/Header";

export function StatusIcon({status}: {status:string}) {
    return status === "correct" ? <IconCorrect className={`ml-auto`} /> : status === "incorrect" ? <IconInorrect className={`ml-auto`} /> : null;
}

export default function Home() {
    const [selected, setSelected] = useState("A");
    const selectedCorrect = true;

    const getStatus = (option:string) => {
        return option === selected ? (selectedCorrect===undefined ? "selected":  selectedCorrect? "correct" : "incorrect") : "unselected";
    }

  return (
    <div className="flex flex-col  min-h-screen items-center justify-center font-sans">
        <Header />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center
                        sm:items-start max-w-[1160px]">
            <section className={`grid xl:grid-cols-[1fr_564px] max-xl:flex-col gap-y-8 gap-x-32 w-full`}>
                <header className={`flex flex-col gap-6`}>
                    <p className={`text-preset-6 text-secondary-foreground`}>Question 6 of 10</p>
                    <h1 className={`text-preset-3 max-w-[20ch]`}>
                        Which of these color contrast ratios defines the minimum WCAG 2.1 Level AA requirement for normal text?
                    </h1>
                    <Progress className={`mt-auto bg-white h-2`} value={50} />
                </header>

                <ul className={`grid gap-4 text-preset-4 w-full`}>
                    <li className={`w-full `} data-status={getStatus("A")}>
                        <button onClick={()=>setSelected("A")} className={`w-full flex items-center p-6 
                                rounded-[24px] gap-8 p-6 bg-secondary border-3 border-status`}>
                            <div className={`flex items-center justify-center rounded-[8px] text-preset-4 h-14 w-14 bg-status 
                                text-status-foreground`}>
                                A
                            </div> 4.5 : 1 <StatusIcon status={getStatus("A")} />
                        </button>
                    </li>
                    <li className={`w-full`} data-status={getStatus("B")}>
                        <button onClick={()=>setSelected("B")} className={`w-full flex items-center p-6 
                                    rounded-[24px] gap-8 p-6 bg-secondary border-3 border-status`}>
                            <div className={`flex items-center justify-center rounded-[8px] text-preset-4 h-14 w-14 bg-status 
                                    text-status-foreground`}>
                                B
                            </div> 4.5 : 1 <StatusIcon status={getStatus("B")} />
                        </button>
                    </li>
                    <li className={`w-full`} data-status={getStatus("C")}>
                        <button onClick={()=>setSelected("C")} className={`w-full flex items-center p-6 
                                    rounded-[24px] gap-8 p-6 bg-secondary border-3 border-status`}>
                            <div className={`flex items-center justify-center rounded-[8px] text-preset-4 h-14 w-14 bg-status 
                                    text-status-foreground`}>
                                C
                            </div> 4.5 : 1 <StatusIcon status={getStatus("C")} />
                        </button>
                    </li>
                    <li className={`w-full`} data-status={getStatus("D")}>
                        <button onClick={()=>setSelected("D")} className={`w-full flex items-center p-6 
                                    rounded-[24px] gap-8 p-6 bg-secondary border-3 border-status`}>
                            <div className={`flex items-center justify-center rounded-[8px] text-preset-4 h-14 w-14 bg-status 
                                    text-status-foreground`}>
                                D
                            </div> 4.5 : 1 <StatusIcon status={getStatus("D")} />
                        </button>
                    </li>
                </ul>

                <div className={`spacer`}></div>

                <button className={`p-8 rounded-[24px] bg-primary text-white text-preset-4`}>Submit Answer</button>
            </section>
      </main>
    </div>
  );
}
