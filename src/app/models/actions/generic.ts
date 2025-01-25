import { ActionButton, ActionProvider } from "../../types";

export const RulesAction: ActionProvider = {
    Id: "rules",
    GetDescriptions: () => [
        $localize`:@@actions-rules-1:Regeln erklären`,
        $localize`:@@actions-rules-2:Anzahl Werwölfe erwähnen`,
        $localize`:@@actions-rules-3:Einleitende Geschichte erzählen`
    ],
    GetButtons: () => []
};

export const NightfallAction: ActionProvider = {
    Id: "night",
    GetDescriptions: () => [
        $localize`:@@actions-night-1:Und das Dorf schläft ein`
    ],
    GetButtons: () => []
};

export const DaybreakAction: ActionProvider = {
    Id: "day",
    GetDescriptions: () => [
        $localize`:@@actions-day-1:Und das Dorf erwacht`,
        $localize`:@@actions-day-2:Informiere über Tode`,
        $localize`:@@actions-day-3:Denke an den Bärenführer`,
        $localize`:@@actions-day-4:Leite Diskussion ein`
    ],
    GetButtons: () => []
};