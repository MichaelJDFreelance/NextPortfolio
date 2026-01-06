import {fromPromise} from "xstate";
import {FormContext} from "../../../db/validators";

export type LoadedSubmission = {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
    };
    plan: {
        type: string;
        yearly: boolean;
    };
    addOns: {
        online: boolean;
        largerStorage: boolean;
        customProfile: boolean;
    };
};

export const fetchPersonalInfo = async () => {
    const response = await fetch("/api/personal-info");
    if (!response.ok) {
        throw new Error("Failed to load personal info");
    }
    return response.json();
}

export const fetchAddOns = async () => {
    const response = await fetch("/api/add-ons"); // Changed endpoint
    if (!response.ok) {
        throw new Error("Failed to load add-ons");
    }
    return response.json();
}

export const fetchPlan = async () => {
    const response = await fetch("/api/plan"); // Changed endpoint
    if (!response.ok) {
        throw new Error("Failed to load plan");
    }
    return response.json();
}

export const savePersonalInfo = fromPromise<unknown, { values: FormContext["personalInfo"] }>(
    async ({input}) => {
        const {values} = input;
        const response = await fetch("/api/personal-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({values}),
        });

        if (!response.ok) {
            throw new Error("Failed to save");
        }

        return response.json();
    })

export const savePlan = fromPromise<unknown, { values: FormContext["plan"] }>(
    async ({input}) => {
        const response = await fetch("/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input.values),
        });

        if (!response.ok) {
            throw new Error("Failed to save");
        }

        return response.json();
    })

export const saveAddOns = fromPromise<unknown, { values: FormContext["addOns"] }>(
    async ({input}) => {
        const response = await fetch("/api/add-ons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input.values),
        });

        if (!response.ok) {
            throw new Error("Failed to save");
        }

        return response.json();
    })

export const loadSubmission = fromPromise<LoadedSubmission>(async () => {
    const all = await Promise.all([fetchPersonalInfo(), fetchPlan(), fetchAddOns()]);

    return {
        personalInfo: all[0],
        plan: all[1],
        addOns: all[2],
    };
})