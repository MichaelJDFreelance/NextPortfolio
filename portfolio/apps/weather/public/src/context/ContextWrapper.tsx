"use client";

import { useState } from "react";
import {ReactNode} from "react";
import {LocationProvider} from "@/context/LocationContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export function ContextWrapper({children}:{children:ReactNode}) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <LocationProvider>
                {children}
            </LocationProvider>
        </QueryClientProvider>
    );
}