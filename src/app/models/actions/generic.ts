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
    title: "Nightfall 🌙",
    points: [
        "And the Village goes to Sleep"
    ],
    buttons: [],
}

export const DaybreakAction: Action = {
    title: "Daybreak ☀️",
    points: [
        "And the Village awakes"
    ],
    buttons: [],
}