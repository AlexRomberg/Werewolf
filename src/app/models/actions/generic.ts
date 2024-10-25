import { Action } from "../../types";

export const RulesAction: Action = {
    Name: "Regeln & Anfang",
    Image: "rules",
    GetPoints: () => [
        "Regeln erklären",
        "Anzahl Werwölfe erwähnen",
        "Einleitende Geschichte erzählen"
    ]
}

export const NightfallAction: Action = {
    Name: "Dämmerung",
    Image: "night",
    GetPoints: () => [
        "Und das Dorf schläft ein"
    ]
}

export const DaybreakAction: Action = {
    Name: "Tagesanbruch",
    Image: "day",
    GetPoints: () => [
        "Und das Dorf erwacht",
        "Informiere über Tode",
        "Denke an den Bärenführer",
        "Leite Diskussion ein"
    ]
}