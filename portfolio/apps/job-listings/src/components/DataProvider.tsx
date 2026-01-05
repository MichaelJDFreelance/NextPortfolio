"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactNode} from "react";
import { render } from '@testing-library/react';

const queryClient = new QueryClient();

export function renderWithQuery(ui: ReactNode) {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    return render(<DataProvider client={client}>{ui}</DataProvider>);
}

export default function DataProvider({ children, client }:{children:ReactNode, client?:QueryClient}) {
    return (
        <QueryClientProvider client={client || queryClient}>
            {children}
        </QueryClientProvider>
    );
}