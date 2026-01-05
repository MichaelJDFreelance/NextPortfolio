import {
    createActor,
    fromPromise,
    setup,
    assign,
    SnapshotFrom,
} from "xstate";
import {Store} from "@tanstack/react-store";

type FormContext = {
    personalInfo: {
        name: string;
        email: string;
        phone: string;
    },
    plan: {
        type: string;
        yearly: boolean;
    },
    addOns: {
        online: boolean;
        largerStorage: boolean;
        customProfile: boolean;
    }
};

type Stage = "personalInfo" | "plan" | "addOns" | "summary";

type FormEvent =  | {
    type: "UPDATE_PERSONAL_INFO";
    values: FormContext["personalInfo"];
} | {
    type: "UPDATE_PLAN";
    values: FormContext["plan"];
} | {
    type: "UPDATE_ADD_ONS";
    values: FormContext["addOns"];
} | {
    type: "FINISH";
} | { type: "GO_TO_STAGE"; stage: Stage };

type LoadedSubmission = {
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

const submissionIdStore = new Store<number | null>(null);

const orderedFormStages = [
    {
        target: "#signup.summary", guard: "shouldProceedToSummary",
    },
    {
        target: "#signup.addOns", guard: "shouldProceedToAddOns",
    },
    {
        target: "#signup.plan", guard: "shouldProceedToPlan",
    },
    {
        target: "#signup.personalInfo", guard: "shouldProceedToPersonalInfo",
    },
]  as const;

export const formMachine = setup({
    types: {
        context: {} as FormContext,
        events: {} as FormEvent,
    },

    actors: {
        savePersonalInfo: fromPromise<unknown, { values: FormContext["personalInfo"] }>(
            async ({input}) => {
            const {values} = input;

            const submissionId = submissionIdStore.state;

            const response = await fetch("/api/personal-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({values, submissionId}),
            });

            if (!response.ok) {
                throw new Error("Failed to save");
            }

            const json = await response.json();

            submissionIdStore.setState(json.submissionId);

            return json;
        }),

        savePlan: fromPromise<unknown, { values: FormContext["plan"] }>(
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
            }),

        saveAddOns: fromPromise<unknown, { values: FormContext["addOns"] }>(
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
            }),

        loadSubmission: fromPromise<LoadedSubmission>(async () => {
            return {
                personalInfo: { name: "", email: "", phone: "" },
                plan: { type: "", yearly: false },
                addOns: { online: false, largerStorage: false, customProfile: false },
            };
        }),
    },

    actions: {
        cachePersonalInfo: assign(({event}) => {
            if (event.type !== "UPDATE_PERSONAL_INFO") return {};
            return {personalInfo: event.values};
        }),

        cachePlan: assign(({event}) => {
            if (event.type !== "UPDATE_PLAN") return {};
            return {plan: event.values};
        }),

        cacheAddOns: assign(({event}) => {
            if (event.type !== "UPDATE_ADD_ONS") return {};
            return {addOns: event.values};
        }),

    },

    guards: {
        shouldProceedToPersonalInfo: ({ event }) => {
            const userHasNotSpecifiedADestination = event.type!=="GO_TO_STAGE";
            const userExplicitlyWantsToGoToPlan = event.type==="GO_TO_STAGE" && event.stage === "personalInfo";
            return (userHasNotSpecifiedADestination || userExplicitlyWantsToGoToPlan)
        },

        shouldProceedToPlan: ({ context, event }) => {
            const userHasNotSpecifiedADestination = event.type!=="GO_TO_STAGE";
            const userExplicitlyWantsToGoToPlan = event.type==="GO_TO_STAGE" && event.stage === "plan";
            const userIsReadyToProceedToPlan = context.personalInfo.name !== "" &&
                context.personalInfo.email !== "";
            return (userHasNotSpecifiedADestination || userExplicitlyWantsToGoToPlan) && userIsReadyToProceedToPlan
        },

        shouldProceedToAddOns: ({ context, event }) => {
            const userHasNotSpecifiedADestination = event.type!=="GO_TO_STAGE";
            const userExplicitlyWantsToGoToAddOns = event.type==="GO_TO_STAGE" && event.stage === "addOns";
            const userIsReadyToProceedToAddOns = context.plan.type !== "";
            return (userHasNotSpecifiedADestination || userExplicitlyWantsToGoToAddOns) && userIsReadyToProceedToAddOns
        },

        shouldProceedToSummary: ({ context, event }) => {
            const userHasNotSpecifiedADestination = event.type!=="GO_TO_STAGE";
            const userExplicitlyWantsToGoToSummary = event.type==="GO_TO_STAGE" && event.stage === "summary";
            const userIsReadyToProceedToSummary = Object.values(context.addOns).some(Boolean);
            return (userHasNotSpecifiedADestination || userExplicitlyWantsToGoToSummary) && userIsReadyToProceedToSummary
        },
    },
}).createMachine({
    id: "signup",

    initial: "initializing",

    /* Initial context */
    context: {
        personalInfo: {
            name: "",
            email: "",
            phone: "",
        },
        plan: {
            type: "",
            yearly: false,
        },
        addOns: {
            online: false,
            largerStorage: false,
            customProfile: false,
        }
    },

    on: {
        GO_TO_STAGE: orderedFormStages,
    },

    states: {

        initializing: {
            invoke: {
                src: "loadSubmission",
                onDone: {
                    target: "routeAfterLoad",
                    actions: assign(({ event }) => ({
                        personalInfo: event.output.personalInfo,
                        plan: event.output.plan,
                        addOns: event.output.addOns,
                    })),
                },
                onError: {
                    target: "personalInfo",
                },
            },
        },

        routeAfterLoad: {
            always: orderedFormStages,
        },

        personalInfo: {
            on: {
                UPDATE_PERSONAL_INFO: {
                    actions: "cachePersonalInfo",
                    target: "savingPersonalInfo",
                }
            },
        },

        savingPersonalInfo: {
            invoke: {
                src: "savePersonalInfo",
                input: ({ context }) => ({
                    values: context.personalInfo,
                }),
                onDone: {
                    target: "plan",
                },
                onError: {
                    target: "personalInfoError",
                },
            },
        },

        personalInfoError: {
            on: {
                UPDATE_PERSONAL_INFO: {
                    actions: "cachePersonalInfo",
                    target: "savingPersonalInfo",
                }
            },
        },

        plan: {
            on: {
                UPDATE_PLAN: {
                    actions: "cachePlan",
                    target: "savingPlan",
                }
            },
        },

        savingPlan: {
            invoke: {
                src: "savePlan",
                input: ({ context }) => ({
                    values: context.plan,
                }),
                onDone: {
                    target: "addOns",
                },
                onError: {
                    target: "planError",
                },
            },
        },

        planError: {
            on: {
                UPDATE_PLAN: {
                    actions: "cachePlan",
                    target: "savingPlan",
                }
            },
        },

        addOns: {
            on: {
                UPDATE_ADD_ONS: {
                    actions: "cacheAddOns",
                    target: "savingAddOns",
                }
            },
        },

        savingAddOns: {
            invoke: {
                src: "saveAddOns",
                input: ({ context }) => ({
                    values: context.addOns,
                }),
                onDone: {
                    target: "summary",
                },
                onError: {
                    target: "addOnsError",
                },
            },
        },

        addOnsError: {
            on: {
                UPDATE_ADD_ONS: {
                    actions: "cacheAddOns",
                    target: "savingAddOns",
                }
            },
        },

        summary: {
            on: {
                FINISH: {
                    target: "done",
                }
            },
        },

        done: {}
    },
});

type FormSnapshot = SnapshotFrom<typeof formMachine>;

type UiMachineStoreState = { snapshot:  FormSnapshot | null };

export const formStore = new Store<UiMachineStoreState>({
    snapshot: null,   // will hold XState snapshot
});

export const formService = createActor(formMachine);

formStore.setState({ snapshot: formService.getSnapshot() });

// Sync XState snapshot → TanStack Store
export const unsubscribe = formService.subscribe((snapshot) => {
    formStore.setState({ snapshot });
});

// Start the actor
formService.start();