"use client"

import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {ReactNode} from "react";

export function DataProviders({children}:{children:ReactNode}) {
    const client = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}