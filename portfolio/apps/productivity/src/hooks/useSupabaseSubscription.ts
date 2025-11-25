import { supabase } from "@/lib/supabase";
import type {
    RealtimePostgresChangesPayload,
    RealtimePostgresChangesFilter,
} from '@supabase/supabase-js'

export function createScopedSubscription<
    TDeps,
    TRow extends Record<string, any> = Record<string, any>
>(
    createName: (deps: TDeps) => string,
    createFilter: (
        deps: TDeps
    ) => RealtimePostgresChangesFilter<'INSERT' | 'UPDATE' | 'DELETE' | '*'>,
    initialDeps: TDeps | null,
    onChange: (payload: RealtimePostgresChangesPayload<TRow>) => void
) {
    let channel: ReturnType<typeof supabase.channel> | null = null
    let currentDeps: TDeps | null = initialDeps

    function subscribe(deps: TDeps) {
        if (channel) channel.unsubscribe()

        channel = supabase
            .channel(createName(deps))
            .on('postgres_changes' as any, createFilter(deps), onChange)
            .subscribe()
    }

    supabase.auth.onAuthStateChange((event, session) => {
        if (session?.access_token) {
            supabase.realtime.setAuth(session.access_token)

            if (currentDeps) {
                subscribe(currentDeps)
            }
        }

        if (event === "SIGNED_OUT") {
            channel?.unsubscribe()
            channel = null
        }
    })

    // Initialize immediately if we already have a session
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.access_token && currentDeps) {
            supabase.realtime.setAuth(session.access_token)
            subscribe(currentDeps)
        }
    })

    return {
        rescope: (deps: TDeps | null) => {
            currentDeps = deps
            if (deps) {
                subscribe(deps)
            } else {
                channel?.unsubscribe()
                channel = null
            }
        },
        dispose: () => {
            channel?.unsubscribe()
            channel = null
        },
    }
}
