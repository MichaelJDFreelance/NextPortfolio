"use client"

import {useHangman} from "@/context/HangmanContext";
import {useKeyPress} from "@/app/hooks/useKeyPress";

function Letter({letter}: { letter: string}) {
    const {context} = useHangman();

    const chosen = context.guessedLetters.includes(letter.toLowerCase());

    return (
        <div className={`${!chosen && "opacity-25"} text-white text-preset-m md:text-preset-l letter !w-10 !h-16 md:w-[112px] md:h-[128px]`}>
            {chosen && letter.toUpperCase()}</div>
    );
}

function Word({word}: { word: string}) {
    const letters = word.split("");

    return (
        <div className={`flex gap-2`}>
            {letters.map((letter:string, index:number) => (
                <Letter key={index} letter={letter} />
            ))}
        </div>
    );
}

function KeyboardLetter({letter}: { letter: string}) {
    const {guessLetter, context} = useHangman();

    const chosen = context.guessedLetters.includes(letter.toLowerCase());

    return (
        <button onClick={()=>guessLetter(letter)}
                className={`text-navy bg-white keyboard-letter text-keyboard-mobile rounded-[8px] md:rounded-[24px]
                md:text-preset-m cursor-pointer !w-7 !h-14 ${chosen && "opacity-25"}`}>
            {!chosen && letter.toUpperCase()}</button>
    );
}

function Keyboard() {
    const letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

    return (
        <div className={`grid grid-cols-9 gap-2 `}>
            {letters.map((letter:string, index:number) => (
                <KeyboardLetter key={index} letter={letter} />
            ))}
        </div>
    );
}

export default function Page() {
    const {context, guessLetter} = useHangman();

    useKeyPress(guessLetter);

    const words = context.blankedWord.split(" ");

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen`}>
            <div className={`flex items-center justify-center`}>
                {words.map((word:string, index:number) => (
                    <Word key={index} word={word} />
                ))}
            </div>
            <Keyboard />
        </div>
    );
}