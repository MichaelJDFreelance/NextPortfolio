"use client"

import {useKeyPress} from "@/hooks/useKeyPress";
import {useStore} from "@tanstack/react-store";
import {calcStore} from "@/lib/calculator/store/calcStore";
import {calculatorActor} from "@/lib/calculator/state/calculatorState";
import {useMemo} from "react";

const numbers = ["0","1","2","3","4","5","6","7","8","9","."]
const operators = ["+","-","*","/"]

type CalculatorKeyProps = {value:string|number, text?:string, className?:string}

const handleInput = (key:string) => {
    if (key==="delete") return calculatorActor.send({type:"DELETE"});
    if (key==="reset") return calculatorActor.send({type:"RESET"});
    if (key==="=") return calculatorActor.send({type:"EVALUATE"});
    if (numbers.includes(key) || operators.includes(key)) return calculatorActor.send({ type:"INPUT_KEY", key });
}

const CalculatorKey = ({value, text, className}:CalculatorKeyProps) => {
    return ( <button onClick={()=>handleInput(value.toString())}
                     className={`ca-key ca-key-${value} ca-text-md ${className} shadow h-16 rounded-lg cursor-pointer`}>{text || value}</button> )
}

export default function Page() {
    const calc = useStore(calcStore)

    useKeyPress(handleInput)

    const result = useMemo(()=>calc.result !== undefined ? calc.result :
        calc.expression.join("") || "0", [calc.result, calc.expression])

    return (
        <div className={`min-h-screen bg-background min-w-screen flex items-center justify-center theme-2 calculator`}>
            <article className={`flex flex-col gap-6 max-w-[540px] w-full`}>
                <header className={`flex justify-between items-center`}>
                    <span className={`ca-text-sm text-foreground`}>calc</span>
                </header>
                <section className={`rounded-lg p-10 flex justify-end ca-text-lg bg-background text-foreground result`}>{result}</section>
                <section className={`grid grid-cols-4 gap-6 p-8 bg-card rounded-lg`}>
                    <CalculatorKey value={7} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={8} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={9} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"delete"} text={"DEL"} className={`!ca-text-default bg-primary text-primary-foreground hover:bg-accent-primary `} />
                    <CalculatorKey value={4} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={5} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={6} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"+"} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={1} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={2} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={3} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"-"} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"."} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={0} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"/"} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"*"} text={"x"} className={`bg-secondary text-secondary-foreground hover:bg-accent-secondary`} />
                    <CalculatorKey value={"reset"} text={"RESET"} className={`!ca-text-default col-span-2 bg-primary text-primary-foreground hover:bg-accent-primary`} />
                    <CalculatorKey value={"="} className={`!ca-text-default col-span-2 bg-destructive text-primary-foreground hover:bg-accent-destructive`} />
                </section>
            </article>
        </div>
    );
}