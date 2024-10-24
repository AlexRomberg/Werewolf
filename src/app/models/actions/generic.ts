import { Action } from "../../types";

export const RulesAction: Action = {
    title: "Regeln & Anfang",
    image: "rules",
    points: [
        "Regeln erklären",
        "Anzahl Werwölfe erwähnen",
        "Einleitende Geschichte erzählen"
    ],
    buttons: [],
    onNext: () => {
        // TODO: Spotify beginning
    }
}

export const NightfallAction: Action = {
    title: "Dämmerung",
    image: "night",
    points: [
        "Und das Dorf schläft ein"
    ],
    buttons: [],
}

export const DaybreakAction: Action = {
    title: "Tagesanbruch",
    image: "day",
    points: [
        "Und das Dorf erwacht",
        "Informiere über Tode",
        "Denke an den Bärenführer",
        "Leite Diskussion ein"
    ],
    buttons: [],
}