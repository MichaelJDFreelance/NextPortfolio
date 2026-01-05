"use client"

import {useQuery} from "@tanstack/react-query";
import {PricingResponse} from "@/lib/types";

export const usePricing = () => {
    const {data} = useQuery<PricingResponse>({
        queryKey: ['pricing'],
        queryFn: () => fetch('/api/pricing').then(res => res.json()),
    })

    return {data}
}