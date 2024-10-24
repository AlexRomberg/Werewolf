import { Action } from "../../types";

export const RulesAction: Action = {
    title: "Rules and Beginning",
    points: [
        "Explain rules",
        "Mention number of werewolf in the game",
        "Start with introduction"
    ],
    buttons: [],
    onNext: () => {
        // TODO: Spotify beginning
    }
}

export const NightfallAction: Action = {
    title: "Nightfall",
    points: [
        "And the village goes to sleep"
    ],
    buttons: [],
}

export const DaybreakAction: Action = {
    title: "Daybreak",
    points: [
        "And the village awakes",
        "Inform about the deaths",
        "Start discussion"
    ],
    buttons: [],
}