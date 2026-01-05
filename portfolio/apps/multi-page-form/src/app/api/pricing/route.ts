// app/api/pricing/route.ts
import {Pricing, PricingResponse} from "@/lib/types";

export async function GET() {
    await new Promise(res => setTimeout(res, 500));

    // 30% chance of failure
    if (Math.random() < 0) {
        return new Response("Server error", { status: 500 });
    }

    const monthly:Pricing = {
        plans: [
            { id: "arcade", price: 9, title: "Arcade" },
            { id: "advanced", price: 12, title: "Advanced" },
            { id: "pro", price: 15, title: "Pro" },
        ],
        addons: [
            { id: "online", price: 1, title:"Online service", description:"Access to multiplayer games" },
            { id: "largerStorage", price: 2, title:"Larger storage", description:"Extra 1TB of cloud save" },
            { id: "customProfile", price: 2, title:"Customizable profile", description:"Customize Toolbar…" },
        ],
        frequency: "mo"
    }

    const annual:Pricing = {
        plans: [
            { id: "arcade", price: 90, title: "Arcade" },
            { id: "advanced", price: 120, title: "Advanced" },
            { id: "pro", price: 150, title: "Pro" },
        ],
        addons: [
            { id: "online", price: 10, title:"Online service", description:"Access to multiplayer games" },
            { id: "largerStorage", price: 20, title:"Larger storage", description:"Extra 1TB of cloud save" },
            { id: "customProfile", price: 20, title:"Customizable profile", description:"Customize Toolbar…" },
        ],
        frequency: "ye"
    }

    return Response.json({ monthly, annual } as PricingResponse);
}