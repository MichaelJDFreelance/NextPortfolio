"use client"

import {useContext} from "react";
import {ColumnContext} from "@/components/Board";

export function Count() {
    const all = useContext(ColumnContext);

    return (
        <>{all?.items.length}</>
    );
}