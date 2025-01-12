import { Action } from "../../types";

export const RulesAction: Action = {
    Id: "rules",
    GetPoints: () => [
        "Regeln erklären",
        "Anzahl Werwölfe erwähnen",
        "Einleitende Geschichte erzählen"
    ]
};

export const NightfallAction: Action = {
    Id: "night",
    GetPoints: () => [
        "Und das Dorf schläft ein"
    ]
};

export const DaybreakAction: Action = {
    Id: "day",
    GetPoints: () => [
        "Und das Dorf erwacht",
        "Informiere über Tode",
        "Denke an den Bärenführer",
        "Leite Diskussion ein"
    ]
};