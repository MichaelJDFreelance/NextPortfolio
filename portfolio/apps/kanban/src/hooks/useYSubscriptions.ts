"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";

// Y.Array -> React array
export function useYArray<T>(arr: Y.Array<T> | undefined | null): T[] {
    const [value, setValue] = useState<T[]>(() =>
        arr && arr.doc ? arr.toArray() : []
    );

    useEffect(() => {
        if (!arr || !arr.doc) {
            // if we lose the array or it's not attached, just show what we had
            return;
        }

        // initial sync
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValue(arr.toArray());

        const observer = () => {
            setValue(arr.toArray());
        };

        arr.observe(observer);
        return () => {
            arr.unobserve(observer);
        };
    }, [arr]);

    return value;
}

// Y.Map -> plain object
export function useYMap(
    map: Y.Map<any> | undefined | null
): Record<string, any> {
    const [value, setValue] = useState<Record<string, any>>(() =>
        map && map.doc ? Object.fromEntries(map.entries()) : {}
    );

    useEffect(() => {
        if (!map || !map.doc) {
            return;
        }

        setValue(Object.fromEntries(map.entries()));

        const observer = () => {
            setValue(Object.fromEntries(map.entries()));
        };

        map.observe(observer);
        return () => {
            map.unobserve(observer);
        };
    }, [map]);

    return value;
}
