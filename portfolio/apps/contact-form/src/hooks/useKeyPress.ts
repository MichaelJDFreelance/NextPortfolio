import { useEffect, useState } from "react";

export function useKeyPress(onKeyPressed: (key:string)=>void) {
   // const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }: KeyboardEvent) {
        /*if (key === targetKey) {
            setKeyPressed(true);
        }*/
    }

    function upHandler({ key }: KeyboardEvent) {
        /*if (key === targetKey) {
            setKeyPressed(false);
        }*/
        onKeyPressed(key);
    }

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        // Clean up event listeners on unmount
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []);

    //return keyPressed;
}