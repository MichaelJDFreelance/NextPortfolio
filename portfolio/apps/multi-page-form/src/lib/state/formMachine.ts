import {
    createActor,
    setup,
    assign,
    SnapshotFrom,
} from "xstate";
import {Store} from "@tanstack/react-store";
import {personalInfoSchema, planSchema} from "../../../db/validators";
import {
    loadSubmission,
    saveAddOns,
    savePersonalInfo,
    savePlan
} from "@/lib/state/api";

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

export type Stage = "personalInfo" | "plan" | "addOns" | "summary";

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

const orderedFormStages = [
    {
        target: "#signup.summary", guard: { type: "canTransitionTo", params: { target: "summary" } },
    },
    {
        target: "#signup.addOns", guard: { type: "canTransitionTo", params: { target: "addOns" } },
    },
    {
        target: "#signup.plan", guard: { type: "canTransitionTo", params: { target: "plan" } },
    },
    {
        target: "#signup.personalInfo", guard: { type: "canTransitionTo", params: { target: "personalInfo" } },
    },
]  as const;

export function isReadyFor(stage: Stage, context: FormContext): boolean {
    switch (stage) {
        case "personalInfo":
            return true;
        case "plan":
            return personalInfoSchema.safeParse(context.personalInfo).success;
        case "addOns":
            return planSchema.safeParse(context.plan).success && isReadyFor("plan", context);
        default:
            return false;
    }
}

export function shouldProceedTo(stage: Stage, context: FormContext, event: FormEvent): boolean {
    const userHasNotSpecifiedADestination = event.type!=="GO_TO_STAGE";
    const userExplicitlyWantsToGoToStage = event.type==="GO_TO_STAGE" && event.stage === stage;
    return (userHasNotSpecifiedADestination || userExplicitlyWantsToGoToStage) && isReadyFor(stage, context);
}

export const formMachine = setup({
    types: {
        context: {} as FormContext,
        events: {} as FormEvent,
    },

    actors: { savePersonalInfo, savePlan, saveAddOns, loadSubmission, },

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
        canTransitionTo: ({ context, event }, params: { target: Stage }) => {
            return shouldProceedTo(params.target, context, event);
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