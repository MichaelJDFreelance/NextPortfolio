export type Pricing = {
    addons: [
        { id: "online", price: number, title:string, description:string },
        { id: "largerStorage", price: number, title:string, description:string },
        { id: "customProfile", price: number, title:string, description:string },
    ],
    plans: [
        { id: "arcade", price: number, title:"Arcade" },
        { id: "advanced", price: number, title:"Advanced" },
        { id: "pro", price: number, title:"Pro" },
    ],
    frequency: "mo" | "ye"
}

export type PricingResponse = {
    annual:Pricing,
    monthly:Pricing
}
