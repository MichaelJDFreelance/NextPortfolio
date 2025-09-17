import { useEffect } from 'react'
import { supabase } from "@/lib/supabase";

export function useScopedSubscription<T>(
    createName: () => string,
    createFilter: (deps: T) => any,
    deps: T,
    onChange: (payload: any) => void
) {
    useEffect(() => {
        const sub = createScopedSubscription(createName, createFilter, deps, onChange)

        return () => sub.dispose()
    }, [JSON.stringify(deps)]) // re-sub when deps change
}

export function createScopedSubscription<T>(
    createName: () => string,
    createFilter: (deps: T) => {
        event: string
        schema: string
        table: string
        filter?: string
    },
    initialDeps: T,
    onChange: (payload: any) => void
) {
    let channel: any

    function subscribe(deps: T) {
        if (channel) channel.unsubscribe()

        channel = supabase
            .channel(createName())
            .on('postgres_changes' as any, createFilter(deps), onChange)
            .subscribe()
    }

    // Initialize
    subscribe(initialDeps)

    return {
        rescope: (deps: T) => subscribe(deps),
        dispose: () => channel?.unsubscribe()
    }
}