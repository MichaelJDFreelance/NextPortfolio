"use client";

import { useStore } from "@tanstack/react-store";

import { PersonalInfo } from "./PersonalInfo";
import {formStore} from "@/lib/state/formMachine";
import {Plan} from "@/components/stages/Plan";
import {AddOns} from "@/components/stages/AddOns";
import {Summary} from "@/components/stages/Summary";

export function SignupWizard() {
    const snapshot = useStore(formStore, (s) => s.snapshot);

    if (!snapshot) return null;

    switch (snapshot.value) {
        case "initializing":
        case "routeAfterLoad":
            return <>Loading</>;

        case "personalInfo":
        case "savingPersonalInfo":
        case "personalInfoError":
            return <PersonalInfo />;

        case "plan":
        case "savingPlan":
        case "planError":
            return <Plan />;

        case "addOns":
        case "savingAddOns":
        case "addOnsError":
            return <AddOns />;

        case "summary":
            return <Summary />;

        case "done":
            return <h1>Well Done!</h1>;

        default:
            throw new Error(`Invalid state: ${snapshot.value}`);
    }
}